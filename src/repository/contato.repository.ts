import { db } from "../database/connection.database";
import { IContato } from "../models/contato.model";
import { ResultSetHeader } from "mysql2/promise";

export class ContatoRepository {
  async findAll(): Promise<IContato[]> {
    const sql = `
      SELECT *
      FROM contatos;
    `;

    const [rows] = await db.execute<IContato[]>(sql);
    return rows;
  }

  async findById(id_contato: number): Promise<IContato[]> {
    const sql = `
      SELECT *
      FROM contatos
      WHERE id_contato = ?;
    `;

    const [rows] = await db.execute<IContato[]>(sql, [id_contato]);
    return rows;
  }

  async create(dados: Omit<IContato, "id_contato">): Promise<ResultSetHeader> {
    const sql = `
      INSERT INTO contatos
        (telefone, email, id_pessoa)
      VALUES (?, ?, ?);
    `;

    const [rows] = await db.execute<ResultSetHeader>(sql, [
      dados.telefone,
      dados.email,
      dados.id_pessoa,
    ]);

    return rows;
  }

  async update(
    id_contato: number,
    dados: Omit<IContato, "id_contato">,
  ): Promise<ResultSetHeader> {
    const sql = `
      UPDATE contatos
      SET
        telefone = ?,
        email = ?,
        id_pessoa = ?
      WHERE id_contato = ?;
    `;

    const [rows] = await db.execute<ResultSetHeader>(sql, [
      dados.telefone,
      dados.email,
      dados.id_pessoa,
      id_contato,
    ]);

    return rows;
  }

  async definirPrincipal(id_contato: number, id_pessoa: number) {
    const conexao = await db.getConnection();

    try {
      await conexao.beginTransaction();

      const [contatos] = await conexao.execute<any[]>(
        `SELECT id_contato, telefone, email
       FROM contatos
       WHERE id_contato = ? AND id_pessoa = ?
       FOR UPDATE`,
        [id_contato, id_pessoa],
      );

      if (contatos.length === 0) {
        await conexao.rollback();
        return false;
      }

      const contato = contatos[0];
      const tipo = contato.telefone !== null ? "telefone" : "email";

      await conexao.execute(
        `UPDATE contatos
       SET principal = 0
       WHERE id_pessoa = ?
       AND ${tipo} IS NOT NULL`,
        [id_pessoa],
      );

      await conexao.execute(
        `UPDATE contatos
       SET principal = 1
       WHERE id_contato = ? AND id_pessoa = ?`,
        [id_contato, id_pessoa],
      );

      await conexao.commit();
      return true;
    } catch (error) {
      await conexao.rollback();
      throw error;
    } finally {
      conexao.release();
    }
  }

  async findByPessoa(id_pessoa: number): Promise<IContato[]> {
    const sql = `
    SELECT
      id_contato,
      telefone,
      email,
      id_pessoa,
      principal
    FROM contatos
    WHERE id_pessoa = ?;
  `;

    const [rows] = await db.execute<IContato[]>(sql, [id_pessoa]);
    return rows;
  }

  async findByCampo(campo: "telefone" | "email") {
    const sql = `
      SELECT ${campo}
      FROM contatos;
    `;

    const [rows] = await db.execute(sql);
    return rows;
  }

  async delete(id_contato: number): Promise<ResultSetHeader> {
    const sql = `
      DELETE FROM contatos
      WHERE id_contato = ?;
    `;

    const [rows] = await db.execute<ResultSetHeader>(sql, [id_contato]);
    return rows;
  }
}
