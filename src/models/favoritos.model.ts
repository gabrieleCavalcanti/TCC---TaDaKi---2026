import { RowDataPacket } from "mysql2";

export interface ICliente extends RowDataPacket {
    id_cliente?: number,
}

export interface IOrganizacao extends RowDataPacket {
    id_organizacao?: number,
}

export interface IFavorito extends RowDataPacket {
    id_favorito?: number;
    id_cliente?: number;
    id_organizacao?: number;
}

export class Favorito {
    private _idFavorito?: number;
    private _idCliente: number = 0;
    private _idOrganizacao: number = 0;


    constructor(_idCliente: number, _id_organizacao: number, id_favorito?: number) {
        this._idCliente = _idCliente;
        this._idOrganizacao = _id_organizacao;
        this._idFavorito = id_favorito;
    }

    public get IdFavorito(): number | undefined {
        return this._idFavorito
    }

    public get IdCliente(): number {
        return this._idCliente
    }

    public get IdOrganizacao(): number {
        return this._idOrganizacao
    }

    public static criar(id_cliente: number, id_organizacao: number): Favorito {
        return new Favorito(id_cliente, id_organizacao)
    }
}

