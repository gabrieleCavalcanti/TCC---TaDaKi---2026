import { Request, Response } from "express";
import { PostService } from "../services/post.service";

export class PostController {
    constructor(private _service = new PostService()) { }

    selecionarTodos = async (req: Request, res: Response) => {
        try {
            const posts = await this._service.selecionarTodos();
            return res.status(200).json({ posts });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).json({ message: "Ocorreu um erro no servidor", errorMessage: error.message });
            }
            return res.status(500).json({ message: "Ocorreu um erro no servidor", errorMessage: "Erro desconhecido" });
        }
    };


    criar = async (req: Request, res: Response) => {
        try {
            const { titulo, descricao, id_categoria, id_organizacao } = req.body;
            if (!titulo || String(titulo).trim() === "") {
                return res.status(400).json({ message: "O título do post é obrigatório" });
            }
            if (!id_categoria || Number(id_categoria) <= 0) {
                return res.status(400).json({ message: "ID da categoria inválido" });
            }
            if (!id_organizacao || Number(id_organizacao) <= 0) {
                return res.status(400).json({ message: "ID da organização inválido" });
            }
            if (!req.file) {
                return res.status(400).json({ message: "A imagem do post é obrigatória" });
            }
            const vincularImagem = req.file.filename;
            const novo = await this._service.criar(
                vincularImagem,
                String(titulo).trim(),
                descricao || "",
                Number(id_categoria),
                Number(id_organizacao)
            );
            return res.status(201).json({
                message: "Post criado com sucesso",
                novo,
                imagem: vincularImagem,
                status: "PUBLICADO"
            });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).json({
                    message: "Ocorreu um erro no servidor",
                    errorMessage: error.message
                });
            }
            return res.status(500).json({
                message: "Ocorreu um erro no servidor",
                errorMessage: "Erro desconhecido"
            });
        }
    };


    editar = async (req: Request, res: Response) => {
        try {
            const id_post = Number(req.query.id_post);
            if (!id_post || id_post <= 0) {
                return res.status(400).json({ message: "ID do post inválido" });
            }
            const postExistente = await this._service.selecionaById(id_post);
            if (!postExistente || postExistente.length === 0) {
                return res.status(404).json({ message: "Post não encontrado" });
            }
            const { titulo, descricao, id_categoria, id_organizacao } = req.body;
            if (!titulo || String(titulo).trim() === "") {
                return res.status(400).json({ message: "O título do post é obrigatório" });
            }
            if (!id_categoria || Number(id_categoria) <= 0) {
                return res.status(400).json({ message: "ID da categoria inválido" });
            }
            if (!id_organizacao || Number(id_organizacao) <= 0) {
                return res.status(400).json({ message: "ID da organização inválido" });
            }

            const vincularImagem = req.file ? req.file.filename : postExistente[0].vincularImagem;
            const alterado = await this._service.editar(
                id_post,
                vincularImagem,
                String(titulo).trim(),
                descricao || "",
                Number(id_categoria),
                Number(id_organizacao)
            );

            return res.status(200).json({
                message: "Post alterado com sucesso",
                alterado,
                imagem: vincularImagem
            });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({
                message: "Ocorreu um erro no servidor",
                errorMessage: "Erro desconhecido"
            });
        }
    };


    arquivar = async (req: Request, res: Response) => {
        try {
            const id_post = Number(req.query.id_post);

            if (!id_post || id_post <= 0) {
                return res.status(400).json({ message: "ID do post inválido" });
            }

            await this._service.arquivar(id_post);

            return res.status(200).json({
                message: "Post arquivado com sucesso",
                id_post,
                status: "ARQUIVADO"
            });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({
                message: "Ocorreu um erro no servidor"
            });
        }
    };


    selecionaById = async (req: Request, res: Response) => {
        try {
            const id_post = Number(req.query.id_post);

            if (!id_post || id_post <= 0) {
                return res.status(400).json({ message: "O ID do post deve ser um número válido" });
            }

            const post = await this._service.selecionaById(id_post);

            if (!post || post.length === 0) {
                return res.status(404).json({ message: "Post não encontrado" });
            }

            return res.status(200).json({ post });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).json({
                    message: "Ocorreu um erro no servidor",
                    errorMessage: error.message
                });
            }
            return res.status(500).json({
                message: "Ocorreu um erro no servidor",
                errorMessage: "Erro desconhecido"
            });
        }
    };


    selecionaByCategoria = async (req: Request, res: Response) => {
        try {
            const id_categoria = Number(req.query.id_categoria);

            if (!id_categoria || id_categoria <= 0) {
                return res.status(400).json({ message: "ID da categoria inválido" });
            }

            const posts = await this._service.selecionaByCategoria(id_categoria);

            return res.status(200).json({ posts });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).json({
                    message: "Ocorreu um erro no servidor",
                    errorMessage: error.message
                });
            }
            return res.status(500).json({
                message: "Ocorreu um erro no servidor",
                errorMessage: "Erro desconhecido"
            });
        }
    };


    selecionaByOrganizacao = async (req: Request, res: Response) => {
        try {
            const id_organizacao = Number(req.query.id_organizacao);

            if (!id_organizacao || id_organizacao <= 0) {
                return res.status(400).json({ message: "ID da organização inválido" });
            }

            const posts = await this._service.selecionaByOrganizacao(id_organizacao);

            return res.status(200).json({ posts });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).json({
                    message: "Ocorreu um erro no servidor",
                    errorMessage: error.message
                });
            }
            return res.status(500).json({
                message: "Ocorreu um erro no servidor",
                errorMessage: "Erro desconhecido"
            });
        }
    };
}