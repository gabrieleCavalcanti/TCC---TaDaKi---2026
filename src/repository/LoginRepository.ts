import { db } from "../database/connection.database";
import { ILogin } from "../models/LoginModel";
import { RowDataPacket, ResultSetHeader } from "mysql2";

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

  async findByEmail(email: string): Promise<ILogin | null> {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT
                login.*,
                pessoas.tipo,
                contatos.email
             FROM login
             INNER JOIN pessoas
                ON pessoas.id_pessoa = login.id_pessoa_login
             INNER JOIN contatos
                ON contatos.id_pessoa = pessoas.id_pessoa
             WHERE contatos.email = ?
             LIMIT 1;`,
      [email],
    );

    return rows.length > 0 ? (rows[0] as ILogin) : null;
  }

  async atualizarSenha(
    idPessoaLogin: number,
    passwordHash: string,
  ): Promise<void> {
    const sql = `
        UPDATE login
        SET password_hash = ?
        WHERE id_pessoa_login = ?;
    `;

    const values = [passwordHash, idPessoaLogin];

    await db.query<ResultSetHeader>(sql, values);
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
