import crypto from "crypto";
import bcrypt from "bcryptjs";

import { LoginRepository } from "../repository/LoginRepository";
import { RecuperacaoSenhaRepository } from "../repository/recuperacaoSenha.repository";
import { EmailService } from "./email.service";

export class RecuperacaoSenhaService {
  private loginRepository: LoginRepository;
  private recuperacaoSenhaRepository: RecuperacaoSenhaRepository;
  private emailService: EmailService;

  constructor() {
    this.loginRepository = new LoginRepository();
    this.emailService = new EmailService();
    this.recuperacaoSenhaRepository = new RecuperacaoSenhaRepository();
  }

  // SOLICITAR RECUPERAÇÃO DE SENHA
  async solicitarRecuperacao(email: string): Promise<void> {
    if (!email || email.trim() === "") {
      throw new Error("E-mail é obrigatório");
    }

    const emailFormatado = email.trim().toLowerCase();

    const login = await this.loginRepository.findByEmail(emailFormatado);

    if (!login) {
      throw new Error("E-mail não encontrado");
    }

    if (!login.id_pessoa_login) {
      throw new Error("ID do usuário não encontrado");
    }

    await this.recuperacaoSenhaRepository.invalidarRecuperacoesAnteriores(
      login.id_pessoa_login,
    );

    const token = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const dataExpiracao = new Date();
    dataExpiracao.setMinutes(dataExpiracao.getMinutes() + 15);

    await this.recuperacaoSenhaRepository.criarRecuperacao(
      login.id_pessoa_login,
      tokenHash,
      dataExpiracao,
    );

    const linkRecuperacao = `http://localhost:5173/redefinir-senha?token=${token}`;

    await this.emailService.enviarEmail(
      emailFormatado,
      "Recuperação de senha - TaDaKi",
      `Olá!

Recebemos uma solicitação para redefinir a senha da sua conta TaDaKi.

Clique no link abaixo para criar uma nova senha:

${linkRecuperacao}

Este link é válido por 15 minutos.

Se você não solicitou a recuperação de senha, ignore este e-mail.

Atenciosamente,
Equipe TaDaKi`,
    );
  }

  // REDEFINIR SENHA

  async redefinirSenha(token: string, novaSenha: string): Promise<void> {
    // 1. Validação básica
    if (!token || token.trim() === "") {
      throw new Error("Token é obrigatório");
    }

    if (!novaSenha || novaSenha.trim() === "") {
      throw new Error("Nova senha é obrigatória");
    }

    // 2. Gera o hash do token recebido
    const tokenHash = crypto
      .createHash("sha256")
      .update(token.trim())
      .digest("hex");

    // 3. Procura o token no banco
    const recuperacao =
      await this.recuperacaoSenhaRepository.buscarPorToken(tokenHash);

    if (recuperacao.length === 0) {
      throw new Error("Token inválido");
    }

    const dadosRecuperacao = recuperacao[0];

    // 4. Verifica se o token já foi usado
    if (dadosRecuperacao.usado) {
      throw new Error("Token já utilizado");
    }

    // 5. Verifica se o token expirou
    const agora = new Date();

    if (new Date(dadosRecuperacao.data_expiracao) <= agora) {
      throw new Error("Token expirado");
    }

    // 6. Gera o hash bcrypt da nova senha
    const passwordHash = await bcrypt.hash(novaSenha, 10);

    // 7. Atualiza a senha no login
    await this.loginRepository.atualizarSenha(
      dadosRecuperacao.id_pessoa_login,
      passwordHash,
    );

    // 8. Marca o token como utilizado
    if (!dadosRecuperacao.id_recuperacao) {
      throw new Error("ID da recuperação não encontrado");
    }

    await this.recuperacaoSenhaRepository.marcarComoUsado(
      dadosRecuperacao.id_recuperacao,
    );
  }
}
