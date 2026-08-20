import { db } from "../database/connection.database";
import { IAvaliacao } from "../models/avaliacao.model";
import { IOrganizacao } from "../models/avaliacao.model";
import { ICliente } from "../models/avaliacao.model";
import { ResultSetHeader } from "mysql2";

export class AvaliacaoRepository {
    async findAll(): Promise<IAvaliacao[]> {
        const [rows] = await db.execute<IAvaliacao[]>(
            'SELECT * FROM avaliacao'
        );
        return rows;
    }

    async selectById(id_avaliacao: number): Promise<IAvaliacao[]> {
        const sql = 'SELECT * FROM avaliacao WHERE id_avaliacao=?;';
        const values = [id_avaliacao];
        const [rows] = await db.execute<IAvaliacao[]>(sql, values);
        return rows
    }
    async selectByIdCliente(id_cliente: number): Promise<ICliente[]> {
        const sql = 'SELECT * FROM Clientes WHERE id_cliente=?;';
        const values = [id_cliente];
        const [rows] = await db.execute<IOrganizacao[]>(sql, values);
        return rows
    }
    async selectByIdOrganizacao(id_organizacao: number): Promise<IOrganizacao[]> {
        const sql = 'SELECT * FROM organizacao WHERE id_organizacao=?;';
        const values = [id_organizacao];
        const [rows] = await db.execute<ICliente[]>(sql, values);
        return rows
    }
    async create(dados: Omit<IAvaliacao, 'id_avaliacao'>): Promise<ResultSetHeader> {
        const sql = 'INSERT INTO avaliacao (comentario, titulo, anonimo, csat, id_cliente, id_organizacao) VALUES(?, ?, ?, ?, ?, ?);';
        const values = [dados._comentario, dados._titulo, dados._anonimo, dados._csat, dados._id_cliente, dados._id_organizacao];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async delete(id_avaliacao: number): Promise<ResultSetHeader> {
        const sql = 'DELETE FROM avaliacao WHERE id_avaliacao=?;';
        const values = [id_avaliacao]
        const [rows] = await db.execute<ResultSetHeader>(sql, values)
        return rows;
    }
}

