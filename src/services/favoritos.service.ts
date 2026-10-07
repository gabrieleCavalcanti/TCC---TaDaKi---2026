import { Favorito } from "../models/favoritos.model";
import { FavoritoRepository } from "../repository/favorito.repository";

export class FavoritoService {
  constructor(private _repository = new FavoritoRepository()) {}

  async selecionaTodos(id_pessoa: number) {
    return await this._repository.findAll(id_pessoa);
  }
  async clienteDaPessoa(id: number) {
    return this._repository.clienteDaPessoa(id);
  }
  async existing(client: number, org: number) {
    return this._repository.existing(client, org);
  }
  async deleteOwned(id: number, client: number) {
    return this._repository.deleteOwned(id, client);
  }
  async selecionaId(id_favorito: number) {
    return await this._repository.selectById(id_favorito);
  }
  async selecionaIdCliente(id_cliente: number) {
    return await this._repository.selectByIdCliente(id_cliente);
  }
  async selecionaIdOrg(id_organizacao: number) {
    return await this._repository.selectByIdOrganizacao(id_organizacao);
  }
  async criar(id_cliente: number, id_organizacao: number) {
    return await this._repository.create({ id_cliente, id_organizacao });
  }
  async deletar(id_favorito: number) {
    return await this._repository.delete(id_favorito);
  }
}
