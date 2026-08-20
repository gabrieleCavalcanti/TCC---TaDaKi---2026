import { Request, Response } from 'express'
import { AvaliacaoService } from "../services/avaliacao.service";

export class AvaliacaoController {
    constructor(private _service = new AvaliacaoService()) { }

    buscarAvaliacao = async (req: Request, res: Response) => {
        try {
            const resultadoSelecionaTodos = await this._service.selecionaTodos();
            res.status(200).json({ resultadoSelecionaTodos })
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' })
        }
    }
    criar = async (req: Request, res: Response) => {
        try {
            const { comentario, titulo, anonimo, csat, id_cliente, id_organizacao } = req.body;

            if (!comentario || !titulo || !id_cliente || !id_organizacao || isNaN(id_cliente) || isNaN(id_organizacao)) {
                return res.status(400).json({ message: 'Verifique os dados e tente novamente' });
            }
            if (anonimo) {
                if (anonimo !== 1 && anonimo !== 0) {
                    return res.status(400).json({ message: 'Valor inválido. Digite 1 para avaliação anônima ou 0 para avaliação identificada' });
                }
            }
            if (!csat || csat < 1 || csat > 5) {
                return res.status(400).json({ message: 'Sua avaliação deve ser um número entre 1 e 5.' });
            }
            const resultadoCliente = await this._service.selecionaIdCliente(id_cliente)
            const resultadoOrg = await this._service.selecionaIdOrg(id_organizacao)

            if (resultadoCliente.length === 0 || resultadoOrg.length === 0) {
                return res.status(200).json({ message: 'Não há dados com algum dos id pesquisados' })
            }

            const novoRegistro = await this._service.criar(comentario, titulo, anonimo, csat, id_cliente, id_organizacao);
            return res.status(201).json({ message: 'Avaliação enviada com sucesso!', novoRegistro });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' })
        }
    }

    deletar = async (req: Request, res: Response) => {
        try {
            const id_avaliacao = Number(req.params.id_avaliacao)
            const resultadoIdAvaliacao = await this._service.selecionaId(id_avaliacao)

            if (isNaN(id_avaliacao) || !id_avaliacao || id_avaliacao < 1) {
                return res.status(400).json({ message: 'ID inválido' });
            }
            if (resultadoIdAvaliacao.length === 0) {
                return res.status(200).json({ message: 'Não há dados com o id pesquisado' })
            }
            const deletado = await this._service.deletar(id_avaliacao);
            res.status(200).json({ message: 'Avaliação excluída com sucesso!', deletado });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' })
        }
    }


} 