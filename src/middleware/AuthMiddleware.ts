import { Request, Response, NextFunction } from "express";
import { JwtService } from "../utils/JwtService";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id_login: number;
                username: string;
            };
        }
    }
}

export class AuthMiddleware {

    private jwtService: JwtService;

    constructor() {
        this.jwtService = new JwtService();
    }

    authenticate = (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {

        // Pega o Access Token do cookie
        const token = req.cookies?.accessToken;

        if (!token) {
            res.status(401).json({
                message: "Token não fornecido"
            });
            return;
        }

        try {

            const decoded =
                this.jwtService.verificarTokenAcesso(token);

            req.user = {
                id_login: decoded.login_id,
                username: decoded.username
            };

            next();

        } catch (error) {

            console.error(error);

            res.status(401).json({
                message: "Token inválido ou expirado"
            });
        }
    };
}





















// import { Request, Response, NextFunction } from "express";
// import { JwtService } from "../utils/JwtService";

// declare global {
//     namespace Express {
//         interface Request {
//             user?: { id_login: number, username: string }
//         }
//     }
// }

// export class AuthMiddleware {
//     private jwtService: JwtService;

//     constructor() {
//         this.jwtService = new JwtService();
//     }

//     authenticate = (req: Request, res: Response, next: NextFunction): void => {
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             res.status(401).json({ message: 'Token não fornecido' });
//             return;
//         }

//         const token = authHeader?.split(' ')[1];

//         try{
//             const decoded = this.jwtService.verificarTokenAcesso(token);
//             req.user = {id_login: decoded.login_id, username: decoded.username};
//             next();
//         } catch (error){
//             res.status(401).json({message: 'Token invalido ou expirado '})
//         }
//     }
// }