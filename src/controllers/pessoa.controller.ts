import { Request, Response } from "express";
import { PessoaService } from "../services/pessoa.service";
import bcrypt from 'bcryptjs';
import { LoginRepository } from "../repository/LoginRepository";
import { JwtService } from "../utils/JwtService";
import axios from "axios";


export class PessoaController {
    // constructor(private _service = new PessoaService()) { }
    private loginRepo: LoginRepository;
    private jwtService: JwtService;
    private bcryptRounds: number;
    constructor(private _service = new PessoaService(),) {
        this.loginRepo = new LoginRepository();
        this.jwtService = new JwtService();
        this.bcryptRounds = Number(process.env.BCRYPT_ROUNDS) || 10;
    }
    selecionaTodos = async (req: Request, res: Response) => {
        try {
            const id = req.query.id;
            const nome = req.query.nome;
            const tipo = req.query.tipo;

            console.log(tipo)
            let paramDup = null;

            if ((id && nome) || (id && tipo) || (nome && tipo)) {
                paramDup = 'Mais de um parâmetro informado, prioridade: ID > NOME > TIPO';
            }

            // ID
            if (id) {

                const id_pessoa = Number(id);
                const pessoaId = await this._service.selecionaId(id_pessoa);

                if (pessoaId.length === 0) {
                    return res.status(404).json({ message: 'Pessoa não localizada' });
                }
                return res.status(200).json({ pessoaId, paramDuplicado: paramDup });
            }

            // NOME
            if (nome) {

                const nome_pessoa = String(nome);
                const pessoaNome = await this._service.selecionaNome(nome_pessoa);

                if (pessoaNome.length === 0) {
                    return res.status(404).json({ message: 'Pessoa não localizada' });
                }

                return res.status(200).json({ pessoaNome, paramDuplicado: paramDup });
            }

            // TIPO
            if (tipo) {

                const tipoPessoa = String(tipo).toUpperCase();

                if (tipoPessoa === 'CLIENTE') {
                    const clientes = await this._service.selecionaTodosClientes();
                    return res.status(200).json({ clientes });
                }

                if (tipoPessoa === 'ORGANIZACAO') {

                    const funcionarios = await this._service.selecionaTodaOrganizacao();

                    return res.status(200).json({ funcionarios });
                }

                return res.status(400).json({ message: 'Tipo inválido' });
            }

            // TODOS
            const pessoas = await this._service.selecionaTodos();

            return res.status(200).json({ pessoas });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
        }
    }
    // criar = async (req: Request, res: Response) => {
    //     try {

    //         const dados = req.body;

    //         console.log(dados);

    //         const novo = await this._service.criar(dados);

    //         return res.status(201).json({ message: "Pessoa criada com sucesso", data: novo });
    //     } catch (error: unknown) {
    //         console.error(error);
    //         if (error instanceof Error) {
    //             res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    //         }
    //         res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });

    //     }
    // }

    // criar = async (req: Request, res: Response) => {

    //     try {
    //         const { nome, tipo, ...infoExtra } = req.body;


    //         if (!nome || nome.trim() === '') {
    //             return res.status(400).json({ message: "Nome é obrigatório" });
    //         }

    //         if (!tipo || tipo.trim() === '') {
    //             return res.status(400).json({ message: "Tipo é obrigatório" });
    //         }

    //         const tiposValidos = [
    //             "CLIENTE",
    //             "ORGANIZACAO"
    //         ];

    //         if (
    //             !tiposValidos.includes(tipo.toUpperCase())
    //         ) {
    //             return res.status(400).json({ message: "Tipo inválido" });
    //         }

    //         switch (tipo.toUpperCase()) {

    //             case "CLIENTE":

    //                 if (!infoExtra.data_nascimento || isNaN(Date.parse(infoExtra.data_nascimento))) {
    //                     return res.status(400).json({ message: "Data Nascimento é obrigatório" });
    //                 }

    //                 break;


    //             case "ORGANIZACAO":

    //                 const cpf = infoExtra.cpf?.trim();
    //                 const cnpj = infoExtra.cnpj?.trim();

    //                 if (!cpf && !cnpj) {
    //                     return res.status(400).json({ message: "CPF ou CNPJ é obrigatório" });
    //                 }

    //                 if (!infoExtra.data_criacao || isNaN(Date.parse(infoExtra.data_criacao))) {
    //                     return res.status(400).json({ message: "Data de criação é obrigatória" });
    //                 }

    //                 if (!infoExtra.id_area_atuacao) {
    //                     return res.status(400).json({ message: "Área de atuação é obrigatória" });
    //                 }

    //                 break;

    //         }

    //         const novo = await this._service.criar(nome, tipo, infoExtra);

    //         return res.status(201).json({ message: "Pessoa criada com sucesso", data: novo });

    //     } catch (error: unknown) {
    //         console.error(error);
    //         if (error instanceof Error) {
    //             res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    //         }
    //         res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
    //     }

    // }

    // editar = async (req: Request, res: Response) => {
    //     try {
    //         const id = Number(req.query.id)
    //         const { nome } = req.body;

    //         if (!nome || nome.trim() === '') {
    //             return res.status(400).json({ message: "Nome é obrigatório" });
    //         }

    //         console.log({ nome, id });
    //         const alterado = await this._service.editar(id, nome);
    //         res.status(200).json({ alterado });

    //     } catch (error: unknown) {
    //         console.error(error);
    //         if (error instanceof Error) {
    //             res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    //         }
    //         res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
    //     }
    // }

    criar = async (req: Request, res: Response) => {
    try {
        const { nome, tipo, ...infoExtra } = req.body;

        // =========================
        // VALIDAÇÃO DA PESSOA
        // =========================

        if (
            !nome ||
            typeof nome !== "string" ||
            nome.trim() === ""
        ) {
            return res.status(400).json({
                message: "Nome inválido"
            });
        }

        const tiposValidos = ["CLIENTE", "ORGANIZACAO"];

        if (
            !tipo ||
            typeof tipo !== "string" ||
            !tiposValidos.includes(tipo.toUpperCase().trim())
        ) {
            return res.status(400).json({
                message: "Tipo inválido"
            });
        }

        const tipoFormatado = tipo.toUpperCase().trim();

        // =========================
        // ENDEREÇO
        // =========================

        // if (!infoExtra.cep || !infoExtra.numero) {
        //     return res.status(400).json({
        //         message: "CEP e número são obrigatórios"
        //     });
        // }

        // const cep = String(infoExtra.cep).replace(/\D/g, "");

        // if (!/^\d{8}$/.test(cep)) {
        //     return res.status(400).json({
        //         message: "CEP inválido"
        //     });
        // }

        // try {
        //     const response = await axios.get(
        //         `https://viacep.com.br/ws/${cep}/json/`
        //     );

        //     const endereco = response.data;

        //     if (endereco.erro) {
        //         return res.status(400).json({
        //             message: "CEP não encontrado"
        //         });
        //     }

        //     infoExtra.cep = cep;
        //     infoExtra.rua = endereco.logradouro;
        //     infoExtra.bairro = endereco.bairro;
        //     infoExtra.municipio = endereco.localidade;
        //     infoExtra.uf = endereco.uf;

        // } catch (error) {
        //     console.error("Erro ao consultar CEP:", error);

        //     return res.status(502).json({
        //         message: "Não foi possível consultar o CEP"
        //     });
        // }

        //api CEP, preciso mandar as informaç~esa

        // =========================
        // EMAIL E TELEFONE
        // =========================

        if (!infoExtra.email || !infoExtra.telefone) {
            return res.status(400).json({
                message: "E-mail e telefone são obrigatórios"
            });
        }

        // Limpa caracteres do telefone
        const telefone = String(infoExtra.telefone).replace(/\D/g, "");

        // Telefone com DDD: 10 ou 11 dígitos
        if (!/^\d{10,11}$/.test(telefone)) {
            return res.status(400).json({
                message: "Telefone inválido"
            });
        }

        // Validação básica do e-mail
        const email = String(infoExtra.email).trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                message: "E-mail inválido"
            });
        }

        infoExtra.telefone = telefone;
        infoExtra.email = email;


        // =========================
        // USERNAME E SENHA
        // =========================

        if (
            !infoExtra.username ||
            typeof infoExtra.username !== "string" ||
            infoExtra.username.trim() === ""
        ) {
            return res.status(400).json({
                message: "Username inválido"
            });
        }

        if (
            !infoExtra.password ||
            typeof infoExtra.password !== "string"
        ) {
            return res.status(400).json({
                message: "Senha inválida"
            });
        }

        if (infoExtra.password.length < 8) {
            return res.status(400).json({
                message: "A senha deve ter ao menos 8 caracteres"
            });
        }

        // Verifica se username já existe
        const userExisting = await this.loginRepo.findByUsername(
            infoExtra.username.trim()
        );

        if (userExisting) {
            return res.status(409).json({
                message: "Username já existe"
            });
        }

        // =========================
        // GERAR HASH DA SENHA
        // =========================

        const password_hash = await bcrypt.hash(
            infoExtra.password,
            this.bcryptRounds
        );

        // Remove a senha original
        delete infoExtra.password;

        // Adiciona somente o hash
        infoExtra.password_hash = password_hash;

        // =========================
        // CLIENTE
        // =========================

        if (tipoFormatado === "CLIENTE") {

            if (
                !infoExtra.data_nascimento ||
                typeof infoExtra.data_nascimento !== "string" ||
                isNaN(Date.parse(infoExtra.data_nascimento))
            ) {
                return res.status(400).json({
                    message: "Data de nascimento inválida"
                });
            }
        }

        // =========================
        // ORGANIZAÇÃO
        // =========================

        if (tipoFormatado === "ORGANIZACAO") {

            const cpf = infoExtra.cpf?.trim();
            const cnpj = infoExtra.cnpj?.trim();

            if (!cpf && !cnpj) {
                return res.status(400).json({
                    message: "CPF ou CNPJ é obrigatório"
                });
            }

            if (cpf && !/^\d{11}$/.test(cpf)) {
                return res.status(400).json({
                    message: "CPF deve conter 11 números"
                });
            }

            if (cnpj && !/^\d{14}$/.test(cnpj)) {
                return res.status(400).json({
                    message: "CNPJ deve conter 14 números"
                });
            }

            if (
                !infoExtra.data_criacao ||
                typeof infoExtra.data_criacao !== "string" ||
                isNaN(Date.parse(infoExtra.data_criacao))
            ) {
                return res.status(400).json({
                    message: "Data de criação é obrigatória"
                });
            }

            if (!infoExtra.id_area_atuacao) {
                return res.status(400).json({
                    message: "Área de atuação é obrigatória"
                });
            }
        }

        // =========================
        // CRIAÇÃO
        // =========================

        const novo = await this._service.criar(
            nome,
            tipoFormatado,
            infoExtra
        );

        return res.status(201).json({
            message: "Pessoa criada com sucesso",
            data: novo
        });

    } catch (error: unknown) {

        console.error(error);

        if (error instanceof Error) {
            return res.status(500).json({
                message: "Ocorreu um erro no servidor",
                errorMessage: error.message
            });
        }

        return res.status(500).json({
            message: "Ocorreu um erro no servidor",
            errorMessage: "Erro desconhecido"
        });
    }
};

    editar = async (req: Request, res: Response) => {
        try {
            const id = req.query.id;
            const { nome, ...infoExtra } = req.body;

            console.log(id, nome)

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ message: "Id inválido" });
            }

            if (!nome || nome.trim() === '') {
                return res.status(400).json({ message: "Nome é obrigatório" });
            }

            // CLIENTE
            if (infoExtra.data_nascimento) {

                if (isNaN(Date.parse(infoExtra.data_nascimento))) {
                    return res.status(400).json({ message: "Data de nascimento inválida" });
                }
            }

            // ORGANIZACAO
            if (infoExtra.cpf || infoExtra.cnpj || infoExtra.data_criacao || infoExtra.id_area_atuacao) {

                const cpf = infoExtra.cpf?.trim();
                const cnpj = infoExtra.cnpj?.trim();

                if (!cpf && !cnpj) {
                    return res.status(400).json({ message: "CPF ou CNPJ é obrigatório" });
                }

                if (cpf && cnpj) {
                    return res.status(400).json({ message: "Informe apenas CPF ou CNPJ" });
                }

                if (!infoExtra.data_criacao || isNaN(Date.parse(infoExtra.data_criacao))
                ) {
                    return res.status(400).json({ message: "Data de criação inválida" });
                }

                if (!infoExtra.id_area_atuacao) {
                    return res.status(400).json({ message: "Área de atuação é obrigatória" });
                }
            }

            await this._service.editar(Number(id), nome, infoExtra);

            return res.status(200).json({ message: "Pessoa atualizada com sucesso" });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
        }
    }
}