import { LikeRepository } from "../repository/like.repository";
import { Like } from "../models/like.model";

export class LikeService {

    constructor(
        private _repository = new LikeRepository()
    ) {}


    async toggle(
        id_post: number,
        id_pessoa: number
    ) {

        if (!id_post || id_post <= 0) {
            throw new Error("ID do post inválido");
        }

        if (!id_pessoa || id_pessoa <= 0) {
            throw new Error("ID da pessoa inválido");
        }

        const postExiste =
            await this._repository.postExiste(
                id_post
            );

        if (!postExiste) {
            throw new Error("Post não encontrado");
        }

        const jaCurtiu =
            await this._repository.findOne(
                id_post,
                id_pessoa
            );

        if (jaCurtiu.length > 0) {

            await this._repository.delete(
                id_post,
                id_pessoa
            );

            const totalLikes =
                await this._repository.countByPost(
                    id_post
                );

            return {
                curtiu: false,
                totalLikes
            };
        }

        const like = Like.criar(
            id_post,
            id_pessoa
        );

        await this._repository.create(
            like.id_post,
            like.id_pessoa
        );

        const totalLikes =
            await this._repository.countByPost(
                id_post
            );

        return {
            curtiu: true,
            totalLikes
        };
    }


    async selecionaByPost(
        id_post: number
    ) {

        return await this._repository.findByPost(
            id_post
        );
    }


    async selecionaByClient(
        id_pessoa: number
    ) {

        return await this._repository.findByClient(
            id_pessoa
        );
    }


    async verificarLike(
        id_post: number,
        id_pessoa: number
    ) {

        const like =
            await this._repository.findOne(
                id_post,
                id_pessoa
            );

        return like.length > 0;
    }


    async contarLikes(
        id_post: number
    ) {

        return await this._repository.countByPost(
            id_post
        );
    }
}