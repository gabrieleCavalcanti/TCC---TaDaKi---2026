import { Avaliacao } from "../models/avaliacao.model";
import { AvaliacaoRepository } from "../repository/avaliacao.repository";

export class AvaliacaoService {
    constructor(private _repository = new AvaliacaoRepository()) { }

    async selecionaTodos() {
        return await this._repository.findAll();
    }
    async selecionaId(id_avaliacao: number) {
        return await this._repository.selectById(id_avaliacao);
    }
    async selecionaIdCliente(id_cliente: number) {
        return await this._repository.selectByIdCliente(id_cliente);
    }
    async selecionaIdOrg(id_organizacao: number) {
        return await this._repository.selectByIdOrganizacao(id_organizacao);
    }
    async criar(comentario: string, titulo: string, anonimo: boolean, csat: number, id_cliente: number, id_organizacao: number) {
        const avaliacao = Avaliacao.criar(comentario, titulo, csat, id_cliente, id_organizacao, anonimo);
        return await this._repository.create(avaliacao)
    }

    async deletar(id_avaliacao: number) {
        return await this._repository.delete(id_avaliacao);
    }
}