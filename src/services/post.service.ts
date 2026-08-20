import { PostRepository } from "../repository/post.repository";
import { Post } from "../models/post.model";

export class PostService {

    constructor(
        private _repository = new PostRepository()
    ) {}


    async selecionarTodos() {

        return await this._repository.findAll();
    }


    async criar(
        vincularImagem: string,
        titulo: string,
        descricao: string,
        id_categoria: number,
        id_organizacao: number
    ) {

        const post = Post.criar(
            vincularImagem,
            titulo,
            descricao,
            id_categoria,
            "PUBLICADO",
            id_organizacao
        );

        return await this._repository.create(
            post
        );
    }


    async editar(
        id_post: number,
        vincularImagem: string,
        titulo: string,
        descricao: string,
        id_categoria: number,
        id_organizacao: number
    ) {

        const existente =
            await this._repository.findById(
                id_post
            );

        if (
            !existente ||
            existente.length === 0
        ) {

            throw new Error(
                "Post não encontrado"
            );
        }

        const postAtual =
            existente[0];

        if (
            postAtual.status === "ARQUIVADO"
        ) {

            throw new Error(
                "Não é possível editar um post arquivado"
            );
        }

        const post = Post.editar(
            id_post,
            vincularImagem,
            titulo,
            descricao,
            id_categoria,
            postAtual.status,
            id_organizacao
        );

        return await this._repository.update(
            id_post,
            post
        );
    }


    async arquivar(
        id_post: number
    ) {

        if (
            !id_post ||
            id_post <= 0
        ) {

            throw new Error(
                "ID do post inválido"
            );
        }

        const post =
            await this._repository.findById(
                id_post
            );

        if (
            !post ||
            post.length === 0
        ) {

            throw new Error(
                "Post não encontrado"
            );
        }

        if (
            post[0].status === "ARQUIVADO"
        ) {

            throw new Error(
                "Este post já está arquivado"
            );
        }

        return await this._repository.arquivar(
            id_post
        );
    }


    async selecionaById(
        id_post: number
    ) {

        return await this._repository.findById(
            id_post
        );
    }


    async selecionaByCategoria(
        id_categoria: number
    ) {

        return await this._repository
            .findByCategoria(
                id_categoria
            );
    }


    async selecionaByOrganizacao(
        id_organizacao: number
    ) {

        return await this._repository
            .findByOrganizacao(
                id_organizacao
            );
    }
}