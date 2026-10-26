import { db } from "../database/connection.database";
import { IFavorito } from "../models/favoritos.model";
import { IOrganizacao } from "../models/avaliacao.model";
import { ICliente } from "../models/avaliacao.model";
import { ResultSetHeader } from "mysql2";

export class FavoritoRepository {

    async findAll(): Promise<IFavorito[]> {
        const [rows] = await db.execute<IFavorito[]>(
            `SELECT
            f.id_favorito,
            f.id_cliente,
            f.id_organizacao
        FROM favoritos f`
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
        const sql = ` SELECT * FROM favoritos WHERE id_cliente = ?;`;
        const values = [id_cliente];
        const [rows] = await db.execute<ICliente[]>(sql, values);
        return rows;
    }

    async selectByIdOrganizacao(id_organizacao: number): Promise<IOrganizacao[]> {
        const sql = ` SELECT * FROM favoritos WHERE id_organizacao = ?; `;
        const values = [id_organizacao];
        const [rows] = await db.execute<IOrganizacao[]>(sql, values);
        return rows;
    }
    async create(dados: Omit<IFavorito, 'id_favorito'>): Promise<ResultSetHeader> {
        const sql = `INSERT INTO favoritos (id_cliente, id_organizacao) VALUES (?, ?); `;
        const values = [dados.id_cliente, dados.id_organizacao];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async delete(id_favorito: number): Promise<ResultSetHeader> {
        const sql = `DELETE FROM favoritos WHERE id_favorito = ?; `;
        const values = [id_favorito];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }
}



