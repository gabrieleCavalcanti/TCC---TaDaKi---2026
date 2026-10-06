import { db } from "../database/connection.database";
import { ILogin } from "../models/LoginModel";
import { RowDataPacket } from "mysql2";

export class LoginRepository {
    async findByUsername(username: string): Promise<ILogin | null> {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT 
                login.*,
                pessoas.tipo
             FROM login
             INNER JOIN pessoas 
                ON pessoas.id_pessoa = login.id_pessoa_login
             WHERE login.username = ?
             LIMIT 1;`,
            [username],
        );

        return rows.length > 0 ? (rows[0] as ILogin) : null;
    }

    async findById(login_id: number): Promise<ILogin | null> {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT 
                login.*,
                pessoas.tipo
             FROM login
             INNER JOIN pessoas 
                ON pessoas.id_pessoa = login.id_pessoa_login
             WHERE login.id_pessoa_login = ?
             LIMIT 1;`,
            [login_id],
        );

        return rows.length > 0 ? (rows[0] as ILogin) : null;
    }
}

// import { db } from "../database/connection.database";
// import { ILogin } from "../models/LoginModel";
// import { ResultSetHeader, RowDataPacket } from "mysql2";

// export class LoginRepository {
//     async findByUsername(username: string): Promise<ILogin | null> {
//         const [rows] = await db.query<RowDataPacket[]>(
//             'SELECT * FROM login WHERE username=? LIMIT 1;',
//             [username],
//         );
//         return rows.length > 0 ? (rows[0] as ILogin) : null;
//     }

//     async findById(login_id: number): Promise<ILogin | null> {
//         const [rows] = await db.query<RowDataPacket[]>(
//             'SELECT * FROM login WHERE id_pessoa_login=? LIMIT 1;',
//             [login_id],
//         );
//         return rows.length > 0 ? (rows[0] as ILogin) : null;
//     }
// }