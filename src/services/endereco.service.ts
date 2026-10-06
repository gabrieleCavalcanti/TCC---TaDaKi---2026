import { EnderecoRepository } from "../repository/endereco.repository";
import { IEndereco } from "../models/endereco.model";

export class EnderecoService {

    constructor(
        private _repository = new EnderecoRepository()
    ) {}

    async selecionarTodos() {
        return await this._repository.findAll();
    }

    async criar(dados: Omit<IEndereco, "id_endereco">) {
        return await this._repository.create(dados);
    }

    async editar(
        id_endereco: number,
        dados: Omit<IEndereco, "id_endereco">
    ) {
        return await this._repository.update(id_endereco, dados);
    }

    async selecionaById(id_endereco: number) {
        return await this._repository.findById(id_endereco);
    }

    async selecionaByPessoa(id_pessoa: number) {
        return await this._repository.findByPessoa(id_pessoa);
    }

    async selecionaByMunicipio(municipio: string) {
        return await this._repository.findByMunicipio(municipio);
    }

    async selecionaByCep(cep: string) {
        return await this._repository.findByCep(cep);
    }
}