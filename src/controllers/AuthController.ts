import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { LoginRepository } from "../repository/LoginRepository";
import { JwtService } from "../utils/JwtService";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export class AuthController {
  private loginRepo: LoginRepository;
  private jwtService: JwtService;
  private bcryptRounds: number;

  constructor() {
    this.loginRepo = new LoginRepository();
    this.jwtService = new JwtService();
    this.bcryptRounds = Number(process.env.BCRYPT_ROUNDS) || 10;
  }

  // =========================
  // LOGIN
  // =========================

  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (
        !username ||
        typeof username !== "string" ||
        username.trim() === ""
      ) {
        return res.status(400).json({
          message: "Username é obrigatório",
        });
      }

      if (!password || typeof password !== "string") {
        return res.status(400).json({
          message: "Senha é obrigatória",
        });
      }

      const user = await this.loginRepo.findByUsername(username.trim());

      if (!user) {
        return res.status(401).json({
          message: "Credenciais inválidas",
        });
      }

      const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Credenciais inválidas",
        });
      }

      const payload = {
        login_id: user.id_pessoa_login!,
        username: user.username,
        tipo: user.tipo,
      };

      const accessToken = this.jwtService.gerarTokenAcesso(payload);

      const refreshToken = this.jwtService.gerarRefreshToken(payload);

      res.cookie("accessToken", accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: "Login realizado com sucesso",

        user: {
          id_pessoa_login: user.id_pessoa_login,
          username: user.username,
          tipo: user.tipo,
        },

        token_acesso: accessToken,
        refresh_token: refreshToken,
      });
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof Error) {
        return res.status(500).json({
          message: "Ocorreu um erro no servidor",
          errorMessage: error.message,
        });
      }

      return res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: "Erro desconhecido",
      });
    }
  };

  // =========================
  // ME
  // =========================

  me = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Usuário não autenticado",
        });
      }

      const user = await this.loginRepo.findById(req.user.id_login);

      if (!user) {
        return res.status(404).json({
          message: "Usuário não encontrado",
        });
      }

      return res.status(200).json({
        message: "Usuário encontrado",
        user: {
          id_pessoa_login: user.id_pessoa_login,
          username: user.username,
          tipo: user.tipo,
        },
      });
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof Error) {
        return res.status(500).json({
          message: "Ocorreu um erro no servidor",
          errorMessage: error.message,
        });
      }

      return res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: "Erro desconhecido",
      });
    }
  };

  // =========================
  // REFRESH
  // =========================

  refresh = async (req: Request, res: Response) => {
    try {
      const refreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          message: "Refresh token não informado",
        });
      }

      const dados = this.jwtService.verificarRefreshToken(refreshToken);

      const payload = {
        login_id: dados.login_id,
        username: dados.username,
        tipo: dados.tipo,
      };

      const accessToken = this.jwtService.gerarTokenAcesso(payload);

      res.cookie("accessToken", accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
      });

      return res.status(200).json({
        message: "Token atualizado com sucesso",
      });
    } catch (error) {
      console.error(error);

      return res.status(401).json({
        message: "Refresh token inválido ou expirado",
      });
    }
  };

  // =========================
  // LOGOUT
  // =========================

  logout = async (req: Request, res: Response) => {
    try {
      res.clearCookie("accessToken", COOKIE_OPTIONS);
      res.clearCookie("refreshToken", COOKIE_OPTIONS);

      return res.status(200).json({
        message: "Logout realizado com sucesso",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro ao realizar logout",
      });
    }
  };

  // =========================
  // ROTA PROTEGIDA
  // =========================

  rotaProtegida = async (req: Request, res: Response) => {
    try {
      return res.status(200).json({
        message: "Você acessou um recurso protegido",
      });
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof Error) {
        return res.status(500).json({
          message: "Ocorreu um erro no servidor",
          errorMessage: error.message,
        });
      }

      return res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: "Erro desconhecido",
      });
    }
  };
}