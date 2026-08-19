import { db } from "../database/connection.database";
import { IAreaAtuacao } from "../models/areaAtuacao.model";
import { ResultSetHeader } from "mysql2";

export class AreaAtuacaoRepository {
    async findAll(): Promise<IAreaAtuacao[]> {
        const [rows] = await db.execute<IAreaAtuacao[]>(
            'SELECT * FROM AreaAtuacao'
        );
        return rows;
    }
    async selectById(id_area_atuacao: number): Promise<IAreaAtuacao[]> {
        const sql = 'SELECT * FROM AreaAtuacao WHERE id_area_atuacao=?;';
        const values = [id_area_atuacao];
        const [rows] = await db.execute<IAreaAtuacao[]>(sql, values);
        return rows
    }
    async selectByDescricao(descricao: string): Promise<IAreaAtuacao[]> {
        const sql = 'SELECT * FROM AreaAtuacao WHERE descricao=?;';
        const values = [descricao];
        const [rows] = await db.execute<IAreaAtuacao[]>(sql, values);
        return rows
    }

    async create(dados: Omit<IAreaAtuacao, 'id_area_atuacao'>): Promise<ResultSetHeader> {
        const sql = 'INSERT INTO AreaAtuacao (descricao) VALUES(?);';
        const values = [dados._descricao];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async update(id_area_atuacao: number, dados: Omit<IAreaAtuacao, 'id_area_atuacao'>): Promise<ResultSetHeader> {
        const sql = 'UPDATE AreaAtuacao SET descricao=? WHERE id_area_atuacao=?;';
        const values = [dados._descricao, id_area_atuacao];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }
}

