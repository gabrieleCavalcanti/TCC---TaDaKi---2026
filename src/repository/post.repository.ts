import { db } from "../database/connection.database";
import { IPost } from "../models/post.model";
import { ResultSetHeader } from "mysql2/promise";

export class PostRepository {

    async findAll(): Promise<IPost[]> {

        const sql = `
            SELECT
                p.id_post,
                p.vincularImagem,
                p.titulo,
                p.descricao,
                p.id_categoria,
                p.status,
                p.id_organizacao
            FROM posts p
            WHERE p.status = 'PUBLICADO'
            ORDER BY p.id_post DESC;
        `;

        const [rows] =
            await db.execute<IPost[]>(sql);

        return rows;
    }


    async findById(
        id_post: number
    ): Promise<IPost[]> {

        const sql = `
            SELECT
                p.id_post,
                p.vincularImagem,
                p.titulo,
                p.descricao,
                p.id_categoria,
                p.status,
                p.id_organizacao
            FROM posts p
            WHERE p.id_post = ?;
        `;

        const [rows] =
            await db.execute<IPost[]>(
                sql,
                [id_post]
            );

        return rows;
    }


    async create(
        dados: Omit<IPost, "id_post">
    ): Promise<ResultSetHeader> {

        const sql = `
            INSERT INTO posts (
                vincularImagem,
                titulo,
                descricao,
                id_categoria,
                status,
                id_organizacao
            )
            VALUES (?, ?, ?, ?, ?, ?);
        `;

        const values = [
            dados.vincularImagem,
            dados.titulo,
            dados.descricao,
            dados.id_categoria,
            dados.status,
            dados.id_organizacao
        ];

        const [result] =
            await db.execute<ResultSetHeader>(
                sql,
                values
            );

        return result;
    }


    async update(
        id_post: number,
        dados: Omit<IPost, "id_post">
    ): Promise<ResultSetHeader> {

        const sql = `
            UPDATE posts
            SET
                vincularImagem = ?,
                titulo = ?,
                descricao = ?,
                id_categoria = ?,
                id_organizacao = ?
            WHERE id_post = ?;
        `;

        const values = [
            dados.vincularImagem,
            dados.titulo,
            dados.descricao,
            dados.id_categoria,
            dados.id_organizacao,
            id_post
        ];

        const [result] =
            await db.execute<ResultSetHeader>(
                sql,
                values
            );

        return result;
    }


    async arquivar(
        id_post: number
    ): Promise<ResultSetHeader> {

        const sql = `
            UPDATE posts
            SET status = 'ARQUIVADO'
            WHERE id_post = ?;
        `;

        const [result] =
            await db.execute<ResultSetHeader>(
                sql,
                [id_post]
            );

        return result;
    }


    async findByCategoria(
        id_categoria: number
    ): Promise<IPost[]> {

        const sql = `
            SELECT
                p.id_post,
                p.vincularImagem,
                p.titulo,
                p.descricao,
                p.id_categoria,
                p.status,
                p.id_organizacao
            FROM posts p
            WHERE p.id_categoria = ?
            AND p.status = 'PUBLICADO'
            ORDER BY p.id_post DESC;
        `;

        const [rows] =
            await db.execute<IPost[]>(
                sql,
                [id_categoria]
            );

        return rows;
    }


    async findByOrganizacao(
        id_organizacao: number
    ): Promise<IPost[]> {

        const sql = `
            SELECT
                p.id_post,
                p.vincularImagem,
                p.titulo,
                p.descricao,
                p.id_categoria,
                p.status,
                p.id_organizacao
            FROM posts p
            WHERE p.id_organizacao = ?
            AND p.status = 'PUBLICADO'
            ORDER BY p.id_post DESC;
        `;

        const [rows] =
            await db.execute<IPost[]>(
                sql,
                [id_organizacao]
            );

        return rows;
    }
}