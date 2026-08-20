import { RowDataPacket } from "mysql2";

export interface ICliente extends RowDataPacket {
    id_cliente?: number,
}

export interface IOrganizacao extends RowDataPacket {
    id_organizacao?: number,
}

export interface IAvaliacao extends RowDataPacket {
    id_avaliacao?: number;
    data?: Date;
    comentario?: string;
    titulo?: string;
    anonimo?: boolean;
    csat?: number;
    id_cliente?: number;
    id_organizacao?: number
}

export class Avaliacao {
    private _id_avaliacao?: number;
    private _data?: Date;
    private _comentario: string = '';
    private _titulo: string = '';
    private _anonimo: boolean;
    private _csat: number;
    private _id_cliente: number = 0
    private _id_organizacao: number = 0


constructor(
    _comentario: string,
    _titulo: string,
    _csat: number,
    _id_cliente: number,
    _id_organizacao: number,
    _anonimo: boolean,
    id_avaliacao?: number,
    data?: Date,
) {
    this._validarComentario(_comentario);
    this._validarTitulo(_titulo);

    this._comentario = _comentario;
    this._titulo = _titulo;
    this._csat = _csat;
    this._anonimo = _anonimo;
    this._id_avaliacao = id_avaliacao;
    this._data = data;
    this._id_cliente = _id_cliente;
    this._id_organizacao = _id_organizacao;
}


    public get IdAvaliacao(): number | undefined {
        return this._id_avaliacao
    }

    public get Data(): Date | undefined {
        return this._data
    }
    public get Comentario(): string {
        return this._comentario
    }

    public get Titulo(): String {
        return this._titulo
    }

    public get Anonimo(): boolean {
        return this._anonimo
    }

    public get Csat(): number {
        return this._csat
    }

    public get IdCliente(): number {
        return this._id_cliente
    }

    public get IdOrganizacao(): number {
        return this._id_organizacao
    }


    public set comentario(value: string) {
        this._validarComentario(value);
        this._comentario = value;
    }

    public set titulo(value: string) {
        this._validarTitulo(value);
        this._titulo = value;
    }

    public static criar(comentario: string, titulo: string, csat: number, id_cliente: number, id_organizacao: number, anonimo: boolean): Avaliacao {
        return new Avaliacao(comentario, titulo, csat, id_cliente, id_organizacao, anonimo)
    }

    private _validarComentario(value: string): void {
        if (!value || value.trim().length < 10) {
            throw new Error('O comentário deve ter pelo menos 10 caracteres')
        }
        if (value.trim().length > 45) {
            throw new Error('O comentário deve ter no máximo 100 caracteres')
        }
    }

    private _validarTitulo(value: string): void {
        if (!value || value.trim().length < 5) {
            throw new Error('O título deve ter pelo menos 5 caracteres')
        }
        if (value.trim().length > 25) {
            throw new Error('O título deve ter no máximo 25 caracteres')
        }
    }
}

