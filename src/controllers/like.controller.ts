import { Request, Response } from "express";
import { LikeService } from "../services/like.service";

export class LikeController {
    constructor(private _service = new LikeService() ) {}

    toggle = async (req: Request,res: Response) => {
        try {
            const id_post =Number(req.body.id_post);
            if (!id_post ||id_post <= 0) {
                return res.status(400).json({
                    message: "ID do post inválido"
                });
            }
            if (!req.user) {
                return res.status(401).json({
                    message: "Usuário não autenticado"
                });
            }
            const id_pessoa =req.user.id_login;
            const resultado =await this._service.toggle(
                    id_post,
                    id_pessoa
                );
            return res.status(200).json({
                message:
                    resultado.curtiu
                        ? "Post curtido com sucesso"
                        : "Curtida removida com sucesso",
                curtiu:
                    resultado.curtiu,
                totalLikes:
                    resultado.totalLikes
            });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(400).json({
                    message: error.message
                });
            }
            return res.status(500).json({
                message:
                    "Ocorreu um erro no servidor"
            });
        }
    };


    verificarLike = async (req: Request,res: Response) => {
        try {
            const id_post =Number(req.query.id_post);
            if (!id_post ||id_post <= 0) {
                return res.status(400).json({
                    message: "ID do post inválido"
                });
            }
            if (!req.user) {
                return res.status(401).json({
                    message: "Usuário não autenticado"
                });
            }
            const id_pessoa =req.user.id_login;
            const curtiu =await this._service.verificarLike(
                    id_post,
                    id_pessoa
                );
            return res.status(200).json({
                curtiu
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message:
                    "Ocorreu um erro no servidor"
            });
        }
    };


    selecionaByPost = async (req: Request,res: Response) => {
        try {
            const id_post =Number(req.query.id_post);
            if (!id_post ||id_post <= 0) {
                return res.status(400).json({
                    message: "ID do post inválido"
                });
            }
            const likes =await this._service.selecionaByPost(id_post );
            return res.status(200).json({
                likes
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message:
                    "Ocorreu um erro no servidor"
            });
        }
    };


    meusLikes = async (req: Request,res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "Usuário não autenticado"
                });
            }
            const id_pessoa =req.user.id_login;
            const likes =await this._service.selecionaByClient(
                    id_pessoa
                );
            return res.status(200).json({
                likes
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message:
                    "Ocorreu um erro no servidor"
            });
        }
    };


    contarLikes = async (req: Request,res: Response) => {
        try {
            const id_post =Number(req.query.id_post);
            if (!id_post ||id_post <= 0) {
                return res.status(400).json({
                    message: "ID do post inválido"
                });
            }
            const total =await this._service.contarLikes(
                    id_post
                );
            return res.status(200).json({
                total
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message:
                    "Ocorreu um erro no servidor"
            });
        }
    };
}