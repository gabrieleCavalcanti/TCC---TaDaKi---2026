
import { RowDataPacket } from "mysql2"; 

export interface IPessoa extends RowDataPacket {
    id_pessoa?: number;
    nome?: string;
    tipo?: string;
}

export class Pessoa {
    private _id_pessoa?: number;
    private _nome: string = '';
    private _tipo?: string;

    //Construtor
    constructor(nome: string, tipo?: string, id_pessoa?: number) {
        this.Nome = nome;
        this._tipo = tipo;
        this._id_pessoa = id_pessoa;
    }

    //GETTERS
    public get Id(): number | undefined {
        return this._id_pessoa;
    }

    public get Nome(): string {
        return this._nome;
    }

    public get Tipo(): string | undefined {
        return this._tipo;
    }

    //SETTERS
    public set Nome(value: string) {
        this._validarNome(value);
        this._nome = value;
    }

    // DP => FACTORY
    public static criar(nome: string, tipo: string): Pessoa {
        return new Pessoa(nome, tipo);
    }

    public static editar(nome: string, id_pessoa: number)  {
        return new Pessoa(nome, undefined, id_pessoa);
    }

    private _validarNome(value: string): void {
        if (!value || value.trim().length < 3) {
            throw new Error('Nome deve ter pelo menos 3 caracteres')
        }
        if(value.trim().length>45){
            throw new Error('Nome deve ter no maximo 45 caracteres')
        }
    }
}