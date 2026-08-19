import { RowDataPacket } from "mysql2";

export interface IAreaAtuacao extends RowDataPacket {
    id_area_atuacao?: number;
    descricao?: string;
}

export class AreaAtuacao {
    private _idAreaAtuacao?: number;
    private _descricao: string = '';

    constructor(_descricao: string, id_area_atuacao?: number) {
        this._validarDescricao(_descricao);
        this._descricao = _descricao;
        this._idAreaAtuacao = id_area_atuacao;
    }

    public get IdAreaAtuacao(): number | undefined {
        return this._idAreaAtuacao;
    }

    public get Descricao(): string {
        return this._descricao;
    }

    public set descricao(value: string) {
        this._validarDescricao(value);
        this._descricao = value;
    }

    public static criar(descricao: string): AreaAtuacao {
        return new AreaAtuacao(descricao);
    }

    public static editar(
        descricao: string,
        id_area_atuacao: number
    ): AreaAtuacao {
        return new AreaAtuacao(descricao, id_area_atuacao);
    }

    private _validarDescricao(value: string): void {
        if (!value || value.trim().length < 3) {
            throw new Error('A descrição deve ter pelo menos 3 caracteres');
        }

        if (value.trim().length > 45) {
            throw new Error('A descrição deve ter no máximo 45 caracteres');
        }
    }
}


