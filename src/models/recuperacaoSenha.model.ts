import { RowDataPacket } from "mysql2";

export interface IRecuperacaoSenha extends RowDataPacket {
  id_recuperacao?: number;

  id_pessoa_login: number;

  token_hash: string;

  data_expiracao: Date;

  usado: boolean;
}

export class RecuperacaoSenha {
  private _id_recuperacao?: number;

  private _id_pessoa_login: number;

  private _token_hash: string;

  private _data_expiracao: Date;

  private _usado: boolean;

  constructor(
    id_pessoa_login: number,

    token_hash: string,

    data_expiracao: Date,

    usado: boolean = false,

    id_recuperacao?: number,
  ) {
    this._id_recuperacao = id_recuperacao;

    this._id_pessoa_login = id_pessoa_login;

    this._token_hash = token_hash;

    this._data_expiracao = data_expiracao;

    this._usado = usado;
  }

  public get id_recuperacao(): number | undefined {
    return this._id_recuperacao;
  }

  public get id_pessoa_login(): number {
    return this._id_pessoa_login;
  }

  public get token_hash(): string {
    return this._token_hash;
  }

  public get data_expiracao(): Date {
    return this._data_expiracao;
  }

  public get usado(): boolean {
    return this._usado;
  }

  public static criar(
    id_pessoa_login: number,

    token_hash: string,

    data_expiracao: Date,
  ): RecuperacaoSenha {
    if (!id_pessoa_login || id_pessoa_login <= 0) {
      throw new Error("ID do usuário inválido");
    }

    if (!token_hash || token_hash.trim() === "") {
      throw new Error("Token inválido");
    }

    if (!data_expiracao) {
      throw new Error("Data de expiração inválida");
    }

    return new RecuperacaoSenha(
      id_pessoa_login,

      token_hash,

      data_expiracao,
    );
  }
}
