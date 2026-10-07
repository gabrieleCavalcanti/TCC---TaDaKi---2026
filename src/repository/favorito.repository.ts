import { db } from "../database/connection.database";
import { IFavorito } from "../models/favoritos.model";
import { IOrganizacao } from "../models/avaliacao.model";
import { ICliente } from "../models/avaliacao.model";
import { ResultSetHeader } from "mysql2";

export class FavoritoRepository {
  async findAll(id_pessoa: number): Promise<IFavorito[]> {
    const [rows] = await db.execute<IFavorito[]>(
      `SELECT f.id_favorito,f.id_cliente,f.id_organizacao,f.data_favoritado,c.nome AS nome_cliente,o.nome AS nome_organizacao FROM favoritos f INNER JOIN clientes cl ON cl.id_cliente=f.id_cliente INNER JOIN pessoas c ON c.id_pessoa=cl.id_pessoa INNER JOIN organizacao org ON org.id_organizacao=f.id_organizacao INNER JOIN pessoas o ON o.id_pessoa=org.id_pessoa WHERE cl.id_pessoa=? ORDER BY f.id_favorito DESC`,
      [id_pessoa],
    );
    return rows;
  }
  async clienteDaPessoa(id_pessoa: number): Promise<number | null> {
    const [rows] = await db.execute<IFavorito[]>(
      "SELECT id_cliente FROM clientes WHERE id_pessoa=?",
      [id_pessoa],
    );
    return Number(rows[0]?.id_cliente) || null;
  }
  async existing(
    id_cliente: number,
    id_organizacao: number,
  ): Promise<IFavorito[]> {
    const [rows] = await db.execute<IFavorito[]>(
      "SELECT * FROM favoritos WHERE id_cliente=? AND id_organizacao=? ORDER BY id_favorito LIMIT 1",
      [id_cliente, id_organizacao],
    );
    return rows;
  }
  async deleteOwned(
    id_organizacao: number,
    id_cliente: number,
  ): Promise<ResultSetHeader> {
    const [rows] = await db.execute<ResultSetHeader>(
      "DELETE FROM favoritos WHERE id_organizacao=? AND id_cliente=?",
      [id_organizacao, id_cliente],
    );
    return rows;
  }
  async selectById(id_favorito: number): Promise<IFavorito[]> {
    const sql = ` SELECT * FROM favoritos WHERE id_favorito = ?; `;
    const values = [id_favorito];
    const [rows] = await db.execute<IFavorito[]>(sql, values);
    return rows;
  }
  async selectByIdCliente(id_cliente: number): Promise<ICliente[]> {
    const sql = ` SELECT * FROM clientes WHERE id_cliente = ?;`;
    const values = [id_cliente];
    const [rows] = await db.execute<ICliente[]>(sql, values);
    return rows;
  }

  async selectByIdOrganizacao(id_organizacao: number): Promise<IOrganizacao[]> {
    const sql = ` SELECT * FROM organizacao WHERE id_organizacao = ?; `;
    const values = [id_organizacao];
    const [rows] = await db.execute<IOrganizacao[]>(sql, values);
    return rows;
  }
  async create(
    dados: Omit<IFavorito, "id_favorito">,
  ): Promise<ResultSetHeader> {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      // Serializa alterações da mesma conta mesmo entre dispositivos.
      await connection.execute(
        "SELECT id_cliente FROM clientes WHERE id_cliente=? FOR UPDATE",
        [dados.id_cliente],
      );
      const [existing] = await connection.execute<IFavorito[]>(
        "SELECT id_favorito FROM favoritos WHERE id_cliente=? AND id_organizacao=? ORDER BY id_favorito LIMIT 1",
        [dados.id_cliente, dados.id_organizacao],
      );
      if (existing.length) {
        await connection.commit();
        return { insertId: Number(existing[0].id_favorito) } as ResultSetHeader;
      }
      const [result] = await connection.execute<ResultSetHeader>(
        "INSERT INTO favoritos (id_cliente,id_organizacao,data_favoritado) VALUES (?,?,CURRENT_TIMESTAMP)",
        [dados.id_cliente, dados.id_organizacao],
      );
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  async delete(id_favorito: number): Promise<ResultSetHeader> {
    const sql = `DELETE FROM favoritos WHERE id_favorito = ?; `;
    const values = [id_favorito];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
}
