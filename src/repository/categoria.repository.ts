import { db } from "../database/connection.database";
import { ICategoria } from "../models/categoria.model";
import { ResultSetHeader } from "mysql2/promise";

export class CategoriaRepository {

    async findAll(): Promise<ICategoria[]> {
    const sql = `SELECT id_categoria, descricao FROM categorias ORDER BY descricao ASC;`;
    const [rows] = await db.execute<ICategoria[]>(sql);
    return rows;
    }

    async findById(id_categoria: number): Promise<ICategoria[]> {
    const sql = `SELECT id_categoria, descricao FROM categorias  WHERE id_categoria = ?;`;
    const [rows] = await db.execute<ICategoria[]>(sql,[id_categoria]);
    return rows;
    }

    async create( dados: Omit<ICategoria, "id_categoria">): Promise<ResultSetHeader> {
    const sql = `INSERT INTO categorias (descricao) VALUES (?);`;
    const [rows] = await db.execute<ResultSetHeader>(sql,[dados.descricao]);
    return rows;
    }

    async update( id_categoria: number,dados: Omit<ICategoria, "id_categoria">): Promise<ResultSetHeader> 
    {const sql = ` UPDATE categorias SET descricao = ? WHERE id_categoria = ?;`;
    const [rows] =await db.execute<ResultSetHeader>(sql,[dados.descricao, id_categoria  ] );
    return rows;
    }

    async findByName( descricao: string): Promise<ICategoria[]> {
    const sql = `SELECT id_categoria, descricao FROM categorias WHERE descricao LIKE ?; `;
    const [rows] = await db.execute<ICategoria[]>( sql, [`%${descricao}%`] )
    return rows;
    }
}
