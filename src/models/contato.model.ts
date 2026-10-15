import { RowDataPacket } from "mysql2";

export interface IContato extends RowDataPacket {
  id_contato?: number;
  telefone?: string;
  email?: string;
  id_pessoa?: number;
  principal?: number;
}

export class Contato {
  private _id_contato?: number;
  private _telefone: string;
  private _email: string;
  private _id_pessoa: number = 0;
  private _principal: number;

  constructor(
    telefone: string,
    email: string,
    id_pessoa: number,
    id_contato?: number,
    principal: number = 0,
  ) {
    this._telefone = telefone;
    this._email = email;
    this._id_pessoa = id_pessoa;
    this._id_contato = id_contato;
    this._principal = principal;
  }

  // GETTERS
  public get IdContato(): number | undefined {
      return this._id_contato;
    }
    
    public get Telefone(): string {
        return this._telefone;
    }
    
    public get Email(): string {
        return this._email;
    }
    
    public get IdPessoa(): number {
        return this._id_pessoa;
    }
    
    public get Principal(): number {
      return this._principal;
    }
    
  // FACTORY
  public static criar(
    telefone: string,
    email: string,
    id_pessoa: number,
  ): Contato {
    return new Contato(telefone, email, id_pessoa);
  }

  public static editar(
    telefone: string,
    email: string,
    id_pessoa: number,
    id_contato: number,
  ): Contato {
    return new Contato(telefone, email, id_pessoa, id_contato);
  }
}
