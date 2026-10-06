import { RowDataPacket } from "mysql2";

export interface ILike extends RowDataPacket {
    id_post: number;
    id_pessoa: number;
    data?: Date;
}

export class Like {

    private _id_post: number;
    private _id_pessoa: number;
    private _data?: Date;

    constructor(
        id_post: number,
        id_pessoa: number,
        data?: Date
    ) {
        this._id_post = id_post;
        this._id_pessoa = id_pessoa;
        this._data = data || new Date();
    }

    public get id_post(): number { return this._id_post;}
    public get id_pessoa(): number {return this._id_pessoa;}
    public get data(): Date | undefined { return this._data;}

    public static criar(
        id_post: number,
        id_pessoa: number
    ): Like {

        if (!id_post || id_post <= 0) {
            throw new Error("ID do post inválido");
        }

        if (!id_pessoa || id_pessoa <= 0) {
            throw new Error("ID da pessoa inválido");
        }

        return new Like(
            id_post,
            id_pessoa
        );
    }
}