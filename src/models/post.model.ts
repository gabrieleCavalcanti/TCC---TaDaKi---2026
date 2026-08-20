import { RowDataPacket } from "mysql2";

export interface IPost extends RowDataPacket {
    id_post?: number;
    vincularImagem: string;
    titulo: string;
    descricao?: string;
    id_categoria: number;
    status: string;
    id_organizacao: number;
}

export class Post {
    private _id_post?: number;
    private _vincularImagem: string;
    private _titulo: string;
    private _descricao: string;
    private _id_categoria: number;
    private _status: string;
    private _id_organizacao: number;

    constructor(
        vincularImagem: string,
        titulo: string,
        descricao: string,
        id_categoria: number,
        status: string,
        id_organizacao: number,
        id_post?: number
    ) {
        this._id_post = id_post;
        this._vincularImagem = vincularImagem;
        this._titulo = titulo;
        this._descricao = descricao;
        this._id_categoria = id_categoria;
        this._status = status;
        this._id_organizacao = id_organizacao;
    }

    public get id_post(): number | undefined {
        return this._id_post;
    }

    public get vincularImagem(): string {
        return this._vincularImagem;
    }

    public get titulo(): string {
        return this._titulo;
    }

    public get descricao(): string {
        return this._descricao;
    }

    public get id_categoria(): number {
        return this._id_categoria;
    }

    public get status(): string {
        return this._status;
    }

    public get id_organizacao(): number {
        return this._id_organizacao;
    }

    public static criar(
        vincularImagem: string,
        titulo: string,
        descricao: string,
        id_categoria: number,
        status: string,
        id_organizacao: number
    ): Post {
        return new Post(
            vincularImagem,
            titulo,
            descricao,
            id_categoria,
            status,
            id_organizacao
        );
    }

    public static editar(
        id_post: number,
        vincularImagem: string,
        titulo: string,
        descricao: string,
        id_categoria: number,
        status: string,
        id_organizacao: number
    ): Post {

        if (!id_post || id_post <= 0) {
            throw new Error("ID do post inválido");
        }

        if (!id_categoria || id_categoria <= 0) {
            throw new Error("ID da categoria inválido");
        }

        if (!id_organizacao || id_organizacao <= 0) {
            throw new Error("ID da organização inválido");
        }

        return new Post(
            vincularImagem,
            titulo,
            descricao,
            id_categoria,
            status,
            id_organizacao,
            id_post
        );
    }
}
