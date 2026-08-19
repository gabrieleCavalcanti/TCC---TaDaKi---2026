import { Request, Response } from "express";
import { OrganizacaoService } from "../services/organizacao.service"; 

export class OrganizacaoController {
    constructor(private _service = new OrganizacaoService()) { }

    selecionaTodos = async (req: Request, res: Response) => {
        try {
            const id = req.query.id

            if (id) {
                const id_organizacao = Number(id);
                const organizacaoId = await this._service.selecionaId(id_organizacao);
                if (organizacaoId.length === 0) {
                    return res.status(200).json({ message: 'organizaçao não localizado' });
                }
                return res.status(200).json({ organizacaoId });
            }

            const organizacoes = await this._service.selecionaTodos();
            res.status(200).json({ organizacoes });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
        }
    }
    editar = async (req: Request, res: Response) => {
        try {
            const id = Number(req.query.id)
            const { id_area_atuacao, data_criacao, cpf, cnpj } = req.body;

            console.log({ id, id_area_atuacao, data_criacao, cpf, cnpj});
            const alterado = await this._service.editar(id, id_area_atuacao, data_criacao, cpf, cnpj);
            res.status(200).json({ alterado });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
        }
    }
    
}