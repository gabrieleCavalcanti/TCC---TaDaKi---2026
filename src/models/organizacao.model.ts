import { RowDataPacket } from "mysql2";

export interface IOrganizacao extends RowDataPacket {
    id_organizacao?: number;
    cpf?: string;
    cnpj?: string;
    data_criacao?: Date;
    id_area_atuacao?: number;
    id_pessoa?: number;
}

export class Organizacao {
    private _id_organizacao?: number;
    private _cpf?: string;
    private _cnpj?: string;
    private _data_criacao: Date;
    private _id_area_atuacao: number = 0;
    private _id_pessoa: number = 0;

    constructor(id_area_atuacao: number, data_criacao: Date, id_pessoa: number, cpf?: string, cnpj?: string, id_organizacao?: number) {
        this._id_area_atuacao = id_area_atuacao;
        this._data_criacao = data_criacao;
        this._cpf = cpf;
        this._cnpj = cnpj;
        this._id_organizacao = id_organizacao;
        this._id_pessoa = id_pessoa;

    }

    // GETTERS
    public get IdPessoa(): number {
        return this._id_pessoa;
    }

    public get IdAreaAtuacao(): number {
        return this._id_area_atuacao;
    }

    public get Cpf(): string | undefined {
        return this._cpf;
    }

    public get Cnpj(): string | undefined {
        return this._cnpj;
    }

    public get IdOrganizacao(): number | undefined {
        return this._id_organizacao;
    }

    public get DataCriacao(): Date {
        return this._data_criacao;
    }

    // FACTORY
    public static criar(id_area_atuacao: number, data_criacao: Date, id_pessoa: number, cpf?: string, cnpj?: string): Organizacao {
        return new Organizacao(id_area_atuacao, data_criacao, id_pessoa, cpf, cnpj);
    }

    public static editar(id_area_atuacao: number, data_criacao: Date, id_organizacao: number, cpf?: string, cnpj?: string): Organizacao {
        return new Organizacao(id_area_atuacao, data_criacao, id_organizacao, cpf, cnpj);
    }
}  