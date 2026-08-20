import { CategoriaRepository } from "../repository/categoria.repository";
import { Categoria } from "../models/categoria.model";

export class CategoriaService {

    constructor(
        private _repository = new CategoriaRepository()
    ) {}

    async selecionarTodos() {
        return await this._repository.findAll();
    }

    async criar( descricao: string ) {
        const categoria =Categoria.criar(descricao);
        return await this._repository.create( categoria );
    }

    async editar( id_categoria: number,  descricao: string ) {
        const categoria =Categoria.editar(  id_categoria, descricao );
        return await this._repository.update( id_categoria, categoria );
    }

    async selecionaById( id_categoria: number ) {
        return await this._repository.findById( id_categoria );
    }

    async selecionaByNome(
        descricao: string ) {
        return await this._repository.findByName(  descricao );
    }
}
