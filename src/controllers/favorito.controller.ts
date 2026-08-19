import { Request, Response } from 'express'
import { FavoritoService } from "../services/favoritos.service";

export class FavoritoController {
    constructor(private _service = new FavoritoService()) { }

    buscarFavorito = async (req: Request, res: Response) => {
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
            const id_cliente = Number(req.body.id_cliente);
            const id_organizacao = Number(req.body.id_organizacao);
            if (!Number.isInteger(id_cliente) ||
                id_cliente < 1 ||
                !Number.isInteger(id_organizacao) ||
                id_organizacao < 1
            ) {
                return res.status(400).json({ message: 'Digite ID válido' });
            }

            const resultadoCliente =
                await this._service.selecionaIdCliente(id_cliente);
            const resultadoOrg =
                await this._service.selecionaIdOrg(id_organizacao);
            if (resultadoCliente.length === 0 || resultadoOrg.length === 0) {
                return res.status(404).json({ message: 'Não há dados com algum dos ID pesquisados' });
            }

            const novoRegistro = await this._service.criar(id_cliente, id_organizacao);
            return res.status(201).json({ message: 'Organização favoritada com sucesso!', novoRegistro });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' })
        }
    };

    deletar = async (req: Request, res: Response) => {
        try {
            const id_favorito = Number(req.params.id_favorito)
            if (isNaN(id_favorito) || !id_favorito || id_favorito < 1) {
                return res.status(400).json({ message: 'ID inválido' });
            }

            const resultadoSelecionaId = await this._service.selecionaId(id_favorito)
            if (resultadoSelecionaId.length === 0) {
                res.status(200).json({ message: `Não há dados com o id pesquisado` });
            }

            const deletado = await this._service.deletar(id_favorito);
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
