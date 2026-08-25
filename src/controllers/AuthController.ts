import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { LoginRepository } from "../repository/LoginRepository";
import { JwtService } from "../utils/JwtService";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const
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

            // Validação do username
            if (
                !username ||
                typeof username !== "string" ||
                username.trim() === ""
            ) {
                return res.status(400).json({
                    message: "Username é obrigatório"
                });
            }

            // Validação da senha
            if (
                !password ||
                typeof password !== "string"
            ) {
                return res.status(400).json({
                    message: "Senha é obrigatória"
                });
            }

            // Procura usuário
            const user = await this.loginRepo.findByUsername(
                username.trim()
            );

            if (!user) {
                return res.status(401).json({
                    message: "Credenciais inválidas"
                });
            }

            // Verifica senha
            const passwordMatch = await bcrypt.compare(
                password,
                user.password_hash
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Credenciais inválidas"
                });
            }

            // Dados que serão colocados no JWT
            const payload = {
                login_id: user.id_pessoa_login!,
                username: user.username
            };

            // Gera Access Token
            const accessToken =
                this.jwtService.gerarTokenAcesso(payload);

            // Gera Refresh Token
            const refreshToken =
                this.jwtService.gerarRefreshToken(payload);

            // Salva Access Token no cookie
            res.cookie(
                "accessToken",
                accessToken,
                {
                    ...COOKIE_OPTIONS,
                    maxAge: 15 * 60 * 1000
                }
            );

            // Salva Refresh Token no cookie
            res.cookie(
                "refreshToken",
                refreshToken,
                {
                    ...COOKIE_OPTIONS,
                    maxAge: 7 * 24 * 60 * 60 * 1000
                }
            );

            // Não devolvemos os tokens no JSON
            return res.status(200).json({
                message: "Login realizado com sucesso",

                user: {
                    id_pessoa_login: user.id_pessoa_login,
                    username: user.username
                },

                token_acesso: accessToken,
                refresh_token: refreshToken
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


    // =========================
    // ME
    // =========================

    me = async (req: Request, res: Response) => {
        try {

            if (!req.user) {
                return res.status(401).json({
                    message: "Usuário não autenticado"
                });
            }

            const user = await this.loginRepo.findById(
                req.user.id_login
            );

            if (!user) {
                return res.status(404).json({
                    message: "Usuário não encontrado"
                });
            }

            return res.status(200).json({
                message: "Usuário encontrado",
                user: {
                    id_pessoa_login: user.id_pessoa_login,
                    username: user.username
                }
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


    // =========================
    // REFRESH
    // =========================

    refresh = async (req: Request, res: Response) => {
        try {

            // Primeiro tenta pegar o cookie
            const refreshToken =
                req.cookies?.refreshToken ||
                req.body?.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({
                    message: "Refresh token não informado"
                });
            }

            // Verifica o Refresh Token
            const dados =
                this.jwtService.verificarRefreshToken(
                    refreshToken
                );

            const payload = {
                login_id: dados.login_id,
                username: dados.username
            };

            // Gera novo Access Token
            const accessToken =
                this.jwtService.gerarTokenAcesso(payload);

            // Atualiza o cookie do Access Token
            res.cookie(
                "accessToken",
                accessToken,
                {
                    ...COOKIE_OPTIONS,
                    maxAge: 15 * 60 * 1000
                }
            );

            return res.status(200).json({
                message: "Token atualizado com sucesso"
            });

        } catch (error) {

            console.error(error);

            return res.status(401).json({
                message: "Refresh token inválido ou expirado"
            });
        }
    };


    // =========================
    // LOGOUT
    // =========================

    logout = async (req: Request, res: Response) => {
        try {

            // Remove os cookies
            res.clearCookie(
                "accessToken",
                COOKIE_OPTIONS
            );

            res.clearCookie(
                "refreshToken",
                COOKIE_OPTIONS
            );

            return res.status(200).json({
                message: "Logout realizado com sucesso"
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message: "Erro ao realizar logout"
            });
        }
    };


    // =========================
    // ROTA PROTEGIDA
    // =========================

    rotaProtegida = async (
        req: Request,
        res: Response
    ) => {

        try {

            return res.status(200).json({
                message: "Você acessou um recurso protegido"
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
}




































































































// import { Request, Response } from "express";
// import bcrypt from "bcryptjs";

// import { LoginRepository } from "../repository/LoginRepository";
// import { JwtService } from "../utils/JwtService";

// export class AuthController {
//     private loginRepo: LoginRepository;
//     private jwtService: JwtService;
//     private bcryptRounds: number;

//     constructor() {
//         this.loginRepo = new LoginRepository();
//         this.jwtService = new JwtService();
//         this.bcryptRounds = Number(process.env.BCRYPT_ROUNDS) || 10;
//     }

//     // =========================
//     // LOGIN
//     // =========================

//     login = async (req: Request, res: Response) => {
//         try {

//             const { username, password } = req.body;

//             // Validação
//             if (
//                 !username ||
//                 typeof username !== "string" ||
//                 username.trim() === ""
//             ) {
//                 return res.status(400).json({
//                     message: "Username é obrigatório"
//                 });
//             }

//             if (
//                 !password ||
//                 typeof password !== "string"
//             ) {
//                 return res.status(400).json({
//                     message: "Senha é obrigatória"
//                 });
//             }

//             // Procura usuário
//             const user = await this.loginRepo.findByUsername(
//                 username.trim()
//             );

//             if (!user) {
//                 return res.status(401).json({
//                     message: "Credenciais inválidas"
//                 });
//             }

//             // Compara senha informada com bcrypt
//             const passwordMatch = await bcrypt.compare(
//                 password,
//                 user.password_hash
//             );

//             if (!passwordMatch) {
//                 return res.status(401).json({
//                     message: "Credenciais inválidas"
//                 });
//             }

//             // Payload do JWT
//             const payload = {
//                 login_id: user.id_pessoa_login!,
//                 username: user.username
//             };

//             // Gera token
//             const accessToken =
//                 this.jwtService.gerarTokenAcesso(payload);

//             const refreshToken =
//                 this.jwtService.gerarRefreshToken(payload);

//             return res.status(200).json({
//                 message: "Login realizado com sucesso",

//                 data: {
//                     token_acesso: accessToken,
//                     refresh_token: refreshToken,
//                     expira_em: process.env.JWT_EXPIRES_IN
//                 }
//             });

//         } catch (error: unknown) {

//             console.error(error);

//             if (error instanceof Error) {
//                 return res.status(500).json({
//                     message: "Ocorreu um erro no servidor",
//                     errorMessage: error.message
//                 });
//             }

//             return res.status(500).json({
//                 message: "Ocorreu um erro no servidor",
//                 errorMessage: "Erro desconhecido"
//             });
//         }
//     };

//     // =========================
//     // ME
//     // =========================

//     me = async (req: Request, res: Response) => {
//         try {

//             if (!req.user) {
//                 return res.status(401).json({
//                     message: "Usuário não autenticado"
//                 });
//             }

//             const user = await this.loginRepo.findById(
//                 req.user.id_login
//             );

//             if (!user) {
//                 return res.status(404).json({
//                     message: "Usuário não encontrado"
//                 });
//             }

//             return res.status(200).json({
//                 message: "Usuário encontrado",
//                 user: {
//                     id_pessoa_login: user.id_pessoa_login,
//                     username: user.username
//                 }
//             });

//         } catch (error: unknown) {

//             console.error(error);

//             if (error instanceof Error) {
//                 return res.status(500).json({
//                     message: "Ocorreu um erro no servidor",
//                     errorMessage: error.message
//                 });
//             }

//             return res.status(500).json({
//                 message: "Ocorreu um erro no servidor",
//                 errorMessage: "Erro desconhecido"
//             });
//         }
//     };

//     // =========================
//     // REFRESH
//     // =========================

//     refresh = async (req: Request, res: Response) => {
//         try {

//             const { refresh_token } = req.body;

//             if (!refresh_token) {
//                 return res.status(401).json({
//                     message: "Refresh token não informado"
//                 });
//             }

//             const dados =
//                 this.jwtService.verificarRefreshToken(refresh_token);

//             const payload = {
//                 login_id: dados.login_id,
//                 username: dados.username
//             };

//             const accessToken =
//                 this.jwtService.gerarTokenAcesso(payload);

//             return res.status(200).json({
//                 message: "Token atualizado com sucesso",

//                 data: {
//                     token_acesso: accessToken,
//                     expira_em: process.env.JWT_EXPIRES_IN
//                 }
//             });

//         } catch (error) {

//             console.error(error);

//             return res.status(401).json({
//                 message: "Refresh token inválido ou expirado"
//             });
//         }
//     };

//     // =========================
//     // ROTA PROTEGIDA
//     // =========================

//     rotaProtegida = async (
//         req: Request,
//         res: Response
//     ) => {

//         try {

//             return res.status(200).json({
//                 message: "Você acessou um recurso protegido"
//             });

//         } catch (error: unknown) {

//             console.error(error);

//             if (error instanceof Error) {
//                 return res.status(500).json({
//                     message: "Ocorreu um erro no servidor",
//                     errorMessage: error.message
//                 });
//             }

//             return res.status(500).json({
//                 message: "Ocorreu um erro no servidor",
//                 errorMessage: "Erro desconhecido"
//             });
//         }
//     };
// }


















































// // import { Request, Response } from "express";
// // import bcrypt from 'bcryptjs';
// // import { LoginRepository } from "../repository/LoginRepository";
// // import { JwtService } from "../utils/JwtService";


// // export class AuthController {
// //     private loginRepo: LoginRepository;
// //     private jwtService: JwtService;
// //     private bcryptRounds: number;

// //     constructor() {
// //         this.loginRepo = new LoginRepository();
// //         this.jwtService = new JwtService();
// //         this.bcryptRounds = Number(process.env.BCRYPT_ROUNDS) || 10;
// //     }

// //     // criar = async (req: Request, res: Response) => {
// //     //     try {
// //     //         const { username, password } = req.body;

// //     //         if (!username || !password)
// //     //             return res.status(400).json({ message: 'Usuario e senha são obrigatorios' });

// //     //         if (password.length < 6)
// //     //             return res.status(400).json({ message: 'A senha deve ter ao menos 6 caracteres' });

// //     //         const userExisting = await this.loginRepo.findByUsername(username.trim());
// //     //         if (userExisting)
// //     //             return res.status(409).json({ message: 'Username já existe' });

// //     //         const password_hash = await bcrypt.hash(password, this.bcryptRounds);
// //     //         const login_id = await this.loginRepo.create(username, password_hash);

// //     //         res.status(201).json({ message: 'Usuario criado com sucesso', data: { login_id, username } });
// //     //     } catch (error: unknown) {
// //     //         console.error(error);
// //     //         if (error instanceof Error) {
// //     //             res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
// //     //         }
// //     //         res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
// //     //     }
// //     // }

// //     login = async (req: Request, res: Response) => {
// //         try {
// //             const { username, password } = req.body;

// //             if (!username || !password)
// //                 return res.status(400).json({ message: 'Usuario e senha são obrigatorios' });

// //             const user = await this.loginRepo.findByUsername(username.trim());
// //             if (!user)
// //                 return res.status(400).json({ message: 'Usuario não encontrado' });

// //             const passwordMatch = await bcrypt.compare(password, user.password_hash);
// //             if (!passwordMatch)
// //                 return res.status(400).json({ message: 'Credenciais inválidas' });

// //             const payload = { login_id: user.id_pessoa_login!, username: user.username };
// //             const accessToken = this.jwtService.gerarTokenAcesso(payload)

// //             res.status(201).json({ message: 'Login realizado com sucesso', data: { token_acesso: accessToken, expira_em: process.env.JWT_EXPIRES_IN } });
// //         } catch (error: unknown) {
// //             console.error(error);
// //             if (error instanceof Error) {
// //                 res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
// //             }
// //             res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
// //         }
// //     }

// //     rotaProtegida = async (req: Request, res: Response) => {
// //         try {

// //             res.status(201).json({
// //                 message: 'Você acesso um recurso protegido'
// //             });
// //         } catch (error: unknown) {
// //             console.error(error);
// //             if (error instanceof Error) {
// //                 res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
// //             }
// //             res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
// //         }
// //     }
// // }