import { Request, Response } from 'express'
import { AreaAtuacaoService } from "../services/areaAtuacao.service";

export class AreaAtuacaoController {
    constructor(private _service = new AreaAtuacaoService()) { }

    buscarArea = async (req: Request, res: Response) => {
        try {
            const id_area_atuacao = Number(req.query.id_area_atuacao);
            if (id_area_atuacao) {
                const resultadoSelecionaId = await this._service.selecionaId(id_area_atuacao)
                if (resultadoSelecionaId.length === 0) {
                    return res.status(200).json({ message: 'Não há dados com o id pesquisado' })
                }
                return res.status(200).json({ resultadoSelecionaId })
            }
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
    buscarPorDescricao = async (req: Request, res: Response) => {
        try {
            const descricao = String(req.query.descricao)
            if (!descricao) {
                return res.status(400).json({ message: 'Insira uma descrição para ser filtrada!' })
            }
            const resultadoDescricao = await this._service.selecionaDescricao(descricao)
            if (resultadoDescricao.length === null) {
                return res.status(200).json({ message: 'Não há dados com o nome pesquisado' })
            }
            return res.status(200).json({ resultadoDescricao })
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
            const { descricao } = req.body;

            if (!descricao || !isNaN(descricao)) {
                return res.status(400).json({ message: 'Insira uma descrição para ser registrada!' })
            }

            const resultadoDescricao = await this._service.selecionaDescricao(descricao);

            if (resultadoDescricao.length > 0) {
                return res.status(400).json({ message: 'Essa descrição já está cadastrada' });
            }

            const novoRegistro = await this._service.criar(descricao);

            return res.status(201).json({ novoRegistro })
        } catch (error: unknown) {
            console.error(error);

            if (error instanceof Error) {
                return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
            }

            return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' })
        }
    }
    editar = async (req: Request, res: Response) => {
        try {
            const { descricao } = req.body;
            const id_area_atuacao = Number(req.params.id_area_atuacao);

            if (!id_area_atuacao || id_area_atuacao < 0 || isNaN(id_area_atuacao)) {
                return res.status(400).json({ message: 'Insira um ID válido!' })
            }

            if (!descricao || !isNaN(descricao)) {
                return res.status(400).json({ message: 'Insira uma descrição para ser registrada!' })
            }

            const resultadoSelecionaId = await this._service.selecionaId(id_area_atuacao);

            if (!resultadoSelecionaId || resultadoSelecionaId.length === 0) {
                return res.status(200).json({ message: 'Não há dados com o id pesquisado' });
            }
            const descricaoAtual = resultadoSelecionaId[0].descricao;
            if (descricaoAtual?.trim().toLowerCase() === descricao.trim().toLowerCase()) {
                return res.status(400).json({ message: 'Não houve alteração na descrição' });
            }




            const alterado = await this._service.editar(descricao, id_area_atuacao);

            return res.status(200).json({ messsage: "Descrição alterada com sucesso", alterado });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
            }
            return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' })
        }
    }


} 