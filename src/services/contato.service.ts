
import { ContatoRepository } from "../repository/contato.repository";
import { IContato } from "../models/contato.model";

export class ContatoService {
  constructor(
    private _repository = new ContatoRepository()
  ) {}

  async selecionarTodos() {
    return await this._repository.findAll();
  }

  async criar(dados: Omit<IContato, "id_contato">) {
    return await this._repository.create(dados);
  }

  async editar(
    id_contato: number,
    dados: Omit<IContato, "id_contato">
  ) {
    return await this._repository.update(id_contato, dados);
  }
  
  async definirPrincipal(id_contato: number, id_pessoa: number) {
  return await this._repository.definirPrincipal(
    id_contato,
    id_pessoa
  );
}

  async selecionaById(id_contato: number) {
    return await this._repository.findById(id_contato);
  }

  async selecionaByPessoa(id_pessoa: number) {
    return await this._repository.findByPessoa(id_pessoa);
  }

  async selecionarPorCampo(campo: "telefone" | "email") {
    return await this._repository.findByCampo(campo);
  }

  async excluir(id_contato: number) {
    return await this._repository.delete(id_contato);
  }
}