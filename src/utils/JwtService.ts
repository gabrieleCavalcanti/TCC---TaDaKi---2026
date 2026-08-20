import jwt from "jsonwebtoken";
import "dotenv/config";

export interface JwtDados {
    login_id: number;
    username: string;
}

export class JwtService {
    private readonly secret: string;
    private readonly expirestIn: string;

    private readonly refreshSecret: string;
    private readonly refreshExpiresIn: string;

    constructor() {
        this.secret = process.env.JWT_SECRET || "default_secret";
        this.expirestIn = process.env.JWT_EXPIRES_IN || "1m";

        this.refreshSecret =
            process.env.JWT_REFRESH_SECRET || "default_refresh_secret";

        this.refreshExpiresIn =
            process.env.JWT_REFRESH_EXPIRES_IN || "7d";
    }

    // ACCESS TOKEN
    gerarTokenAcesso(dados: JwtDados): string {
        return jwt.sign(
            dados,
            this.secret,
            {
                expiresIn:
                    this.expirestIn as jwt.SignOptions["expiresIn"],
            }
        );
    }

    verificarTokenAcesso(token: string): JwtDados {
        return jwt.verify(
            token,
            this.secret
        ) as JwtDados;
    }

    // REFRESH TOKEN
    gerarRefreshToken(dados: JwtDados): string {
        return jwt.sign(
            dados,
            this.refreshSecret,
            {
                expiresIn:
                    this.refreshExpiresIn as jwt.SignOptions["expiresIn"],
            }
        );
    }

    verificarRefreshToken(token: string): JwtDados {
        return jwt.verify(
            token,
            this.refreshSecret
        ) as JwtDados;
    }

    decodificarToken(token: string): JwtDados | null {
        return jwt.decode(token) as JwtDados | null;
    }
}
















































// import jwt from 'jsonwebtoken';
// import 'dotenv/config';

// export interface JwtDados {
//     login_id: number;
//     username: string;
// }

// export class JwtService {
//     private readonly secret: string;
//     private readonly expirestIn: string;

//     constructor() {
//         this.secret = process.env.JWT_SECRET || 'defaut_secret';
//         this.expirestIn = process.env.JWT_EXPIRES_IN || '1m';
//     }

//     gerarTokenAcesso(dados: JwtDados): string {
//         return jwt.sign(dados, this.secret, {
//             expiresIn: this.expirestIn as jwt.SignOptions['expiresIn'],
//         })
//     }

//     verificarTokenAcesso(token: string): JwtDados {
//         return jwt.verify(token, this.secret) as JwtDados;
//     }

//     decodificarToken(token: string): JwtDados | null {
//         return jwt.decode(token) as JwtDados | null;
//     }
// }