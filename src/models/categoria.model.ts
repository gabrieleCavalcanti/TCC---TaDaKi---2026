import { RowDataPacket } from "mysql2";

export interface ICategoria extends RowDataPacket {
    id_categoria?: number;
    descricao?: string;
}
export class Categoria {
    private _id_categoria?: number;
    private _descricao: string = "";
    constructor(descricao: string, id_categoria?: number) {
        this._descricao = descricao;
        this._id_categoria = id_categoria;


    }

    public get id_categoria(): number | undefined { return this._id_categoria; }
    public get descricao(): string { return this._descricao; }

    public set descricao(value: string) {
        if (!value || value.trim().length < 3) {
            throw new Error("O nome da categoria deve ter pelo menos 3 caracteres");
        }
        this._descricao = value;
    }
    public static criar(descricao: string,): Categoria {
        return new Categoria(descricao);
    }
    public static editar(id_categoria: number, descricao: string): Categoria {
        if (!id_categoria || id_categoria <= 0) throw new Error("id invalido para edição");
        return new Categoria(descricao, id_categoria);
    }
   
}
