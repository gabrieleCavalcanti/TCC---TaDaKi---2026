import { Request, Response } from "express";
import { CategoriaService } from "../services/categoria.service";

export class CategoriaController {
constructor(private _service = new CategoriaService() ) {}

    selecionarTodos = async ( req: Request, res: Response) => {
        try {
            const categorias = await this._service.selecionarTodos();
            return res.status(200).json({ categorias});

        } catch (error: unknown) {
            console.error(error);
            return res.status(500).json({
                message: "Ocorreu um erro no servidor"
            });
        }
    };


    criar = async ( req: Request, res: Response ) => {
        try {
            const { descricao } = req.body;
            if ( !descricao ||String(descricao).trim() === "") {
                return res.status(400).json({
                    message: "A descrição da categoria é obrigatória"
                });
            }

            const novo =
                await this._service.criar(
                    String(descricao)
                );

            return res.status(201).json({
                message: "Categoria criada com sucesso",
                novo
            });

        } catch (error: unknown) {

            console.error(error);

            if (error instanceof Error) {

                return res.status(400).json({
                    message: error.message
                });
            }

            return res.status(500).json({
                message: "Ocorreu um erro no servidor"
            });
        }
    };


    editar = async (
        req: Request,
        res: Response
    ) => {

        try {

            const id_categoria =
                Number(req.query.id);

            const { descricao } =
                req.body;

            if (
                !id_categoria ||
                id_categoria <= 0
            ) {

                return res.status(400).json({
                    message: "ID da categoria inválido"
                });
            }

            const alterado =
                await this._service.editar(
                    id_categoria,
                    descricao
                );

            return res.status(200).json({
                message: "Categoria alterada com sucesso",
                alterado
            });

        } catch (error: unknown) {

            console.error(error);

            if (error instanceof Error) {

                return res.status(400).json({
                    message: error.message
                });
            }

            return res.status(500).json({
                message: "Ocorreu um erro no servidor"
            });
        }
    };


    selecionaById = async (
        req: Request,
        res: Response
    ) => {

        try {

            const id_categoria =
                Number(req.query.id);

            if (
                !id_categoria ||
                id_categoria <= 0
            ) {

                return res.status(400).json({
                    message: "ID da categoria inválido"
                });
            }

            const categoria =
                await this._service.selecionaById(
                    id_categoria
                );

            if (categoria.length === 0) {

                return res.status(404).json({
                    message: "Categoria não encontrada"
                });
            }

            return res.status(200).json({
                categoria
            });

        } catch (error: unknown) {

            console.error(error);

            return res.status(500).json({
                message: "Ocorreu um erro no servidor"
            });
        }
    };


    selecionaByNome = async (
        req: Request,
        res: Response
    ) => {

        try {

            const descricao =
                String(req.query.descricao || "");

            if (!descricao.trim()) {

                return res.status(400).json({
                    message: "Digite uma descrição de categoria"
                });
            }

            const categorias =
                await this._service.selecionaByNome(
                    descricao
                );

            if (categorias.length === 0) {

                return res.status(404).json({
                    message: "Nenhuma categoria encontrada"
                });
            }

            return res.status(200).json({
                categorias
            });

        } catch (error: unknown) {

            console.error(error);

            return res.status(500).json({
                message: "Ocorreu um erro no servidor"
            });
        }
    };
}
