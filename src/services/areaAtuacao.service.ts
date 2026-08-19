import { AreaAtuacao } from "../models/areaAtuacao.model";
import { AreaAtuacaoRepository } from "../repository/areaAtuacao.repository";

export class AreaAtuacaoService {
    constructor(private _repository = new AreaAtuacaoRepository()) { }

    async selecionaTodos() {
        return await this._repository.findAll();
    }
    async selecionaId(id_area_atuacao: number) {
        return await this._repository.selectById(id_area_atuacao);
    }
    
    async selecionaDescricao(descricao: string) {
        return await this._repository.selectByDescricao(descricao)
    }
    async criar(descricao: string) {
        const areaAtuacao = AreaAtuacao.criar(descricao);
        console.log(areaAtuacao);
        return await this._repository.create(areaAtuacao)
    }
    async editar(descricao: string, id_area_atuacao: number) {
        const areaAtuacao = AreaAtuacao.editar(descricao, id_area_atuacao);
        return await this._repository.update(id_area_atuacao, areaAtuacao);
    }
}