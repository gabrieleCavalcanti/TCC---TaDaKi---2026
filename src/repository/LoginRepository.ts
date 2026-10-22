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

  async createFromGoogle(dados: {
    nome: string;
    email: string;
    password_hash: string;
  }): Promise<ILogin> {
    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      // 1. Cria a pessoa (quem entra pelo Google começa como CLIENTE)
      const [pessoa] = await conn.query<ResultSetHeader>(
        `INSERT INTO pessoas (nome, tipo) VALUES (?, 'CLIENTE');`,
        [dados.nome],
      );
      const idPessoa = pessoa.insertId;

      // 2. Gera um username único a partir do e-mail
      const base =
        dados.email
          .split("@")[0]
          .toLowerCase()
          .replace(/[^a-z0-9._]/g, "")
          .slice(0, 80) || "usuario";

      let username = base;
      while (true) {
        const [existe] = await conn.query<RowDataPacket[]>(
          `SELECT 1 FROM login WHERE username = ? LIMIT 1;`,
          [username],
        );
        if (existe.length === 0) break;
        username = `${base}${Math.floor(1000 + Math.random() * 9000)}`;
      }

      // 3. Cria o login (o id é o mesmo da pessoa, conforme sua FK)
      await conn.query(
        `INSERT INTO login (id_pessoa_login, username, password_hash)
       VALUES (?, ?, ?);`,
        [idPessoa, username, dados.password_hash],
      );

      // 4. Cria o contato com o e-mail
      await conn.query(
        `INSERT INTO contatos (email, id_pessoa, principal)
       VALUES (?, ?, 1);`,
        [dados.email, idPessoa],
      );

      await conn.commit();

      const user = await this.findById(idPessoa);
      if (!user) throw new Error("Falha ao criar usuário via Google");
      return user;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
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
