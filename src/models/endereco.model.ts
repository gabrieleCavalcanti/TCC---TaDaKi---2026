import { RowDataPacket } from "mysql2";

export interface IEndereco extends RowDataPacket {
    id_endereco?: number;
    rua?: string;
    numero?: string;
    bairro?: string;
    municipio?: string;
    cep?: string;
    uf?: string;
    id_pessoa?: number;
}

export class Endereco {
    private _id_endereco?: number;
    private _rua: string;
    private _numero: string;
    private _bairro: string;
    private _municipio: string;
    private _cep: string;
    private _uf: string;
    private _id_pessoa: number = 0;

    // CONSTRUTOR
    constructor(
        rua: string,
        numero: string,
        bairro: string,
        municipio: string,
        cep: string,
        uf: string,
        id_pessoa: number,
        id_endereco?: number
    ) {
        this._rua = rua;
        this._numero = numero;
        this._bairro = bairro;
        this._municipio = municipio;
        this._cep = cep;
        this._uf = uf;
        this._id_endereco = id_endereco;
        this._id_pessoa = id_pessoa;
    }

    // GETTERS
    public get IdEndereco(): number | undefined {
        return this._id_endereco;
    }

    public get Rua(): string {
        return this._rua;
    }

    public get Numero(): string {
        return this._numero;
    }

    public get Bairro(): string {
        return this._bairro;
    }

    public get Municipio(): string {
        return this._municipio;
    }

    public get Cep(): string {
        return this._cep;
    }

    public get Uf(): string {
        return this._uf;
    }

    public get IdPessoa(): number {
        return this._id_pessoa;
    }

    // FACTORY
    public static criar(
        rua: string,
        numero: string,
        bairro: string,
        municipio: string,
        cep: string,
        uf: string,
        id_pessoa: number
    ): Endereco {
        return new Endereco(
            rua,
            numero,
            bairro,
            municipio,
            cep,
            uf,
            id_pessoa
        );
    }

    public static editar(
        rua: string,
        numero: string,
        bairro: string,
        municipio: string,
        cep: string,
        uf: string,
        id_pessoa: number,
        id_endereco: number
    ): Endereco {
        return new Endereco(
            rua,
            numero,
            bairro,
            municipio,
            cep,
            uf,
            id_pessoa,
            id_endereco
        );
    }
}