import { db } from "../database/connection.database";
import { ILike } from "../models/like.model";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface ITotalLike extends RowDataPacket {
    total: number;
}

export class LikeRepository {
    async findByPost(id_post: number): Promise<ILike[]> {
        const sql = ` SELECT Posts_id_post AS id_post, Pessoas_id_pessoa AS id_pessoa, data FROM likes WHERE Posts_id_post = ?ORDER BY data DESC;`;
        const [rows] = await db.execute<ILike[]>( sql, [id_post]  );
        return rows;
    }

    async findByClient( id_pessoa: number): Promise<ILike[]> {
    const sql = `SELECT  Posts_id_post AS id_post, Pessoas_id_pessoa AS id_pessoa, data
            FROM likes
            WHERE Pessoas_id_pessoa = ?
            ORDER BY data DESC; `;
    const [rows] = await db.execute<ILike[]>( sql, [id_pessoa] );

        return rows;
    }


    async create( id_post: number, id_pessoa: number): Promise<ResultSetHeader> {
    const sql = ` INSERT INTO likes (  Posts_id_post,  Pessoas_id_pessoa )VALUES (?, ?); `;
    const [result] = await db.execute<ResultSetHeader>( sql, [ id_post, id_pessoa  ] );
        return result;
    }


    async delete( id_post: number,id_pessoa: number ): Promise<ResultSetHeader> {
    const sql = ` DELETE FROM likes WHERE Posts_id_post = ? AND Pessoas_id_pessoa = ?;`;
    const [result] = await db.execute<ResultSetHeader>( sql, [  id_post,  id_pessoa ] );
        return result;
    }


    async findOne( id_post: number, id_pessoa: number ): Promise<ILike[]> {
    const sql = ` SELECT Posts_id_post AS id_post,  Pessoas_id_pessoa AS id_pessoa,  data FROM likes WHERE Posts_id_post = ? AND Pessoas_id_pessoa = ? LIMIT 1; `;
    const [rows] = await db.execute<ILike[]>( sql, [  id_post, id_pessoa ] );
        return rows;
    }


    async countByPost( id_post: number ): Promise<number> {
    const sql = `  SELECT COUNT(*) AS total  FROM likes WHERE Posts_id_post = ?; `;
    const [rows] = await db.execute<ITotalLike[]>( sql, [id_post] );
    return Number(rows[0].total);
    }


    async postExiste( id_post: number): Promise<boolean> {
    const sql = ` SELECT id_post FROM posts WHERE id_post = ? LIMIT 1;`;
    const [rows] = await db.execute<RowDataPacket[]>(  sql, [id_post] );
    return rows.length > 0;
    }
}