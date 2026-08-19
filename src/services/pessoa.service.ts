import { PessoaRepository } from "../repository/pessoa.repository";
import { Pessoa } from "../models/pessoa.model";

export class PessoaService {
    constructor(private _repository = new PessoaRepository(),
    ) { }

    async selecionaTodos() {
        return await this._repository.findAll();
    }

    async selecionaId(id_pessoa: number) {
        return await this._repository.findId(id_pessoa);
    }

    async selecionaNome(nome: string) {
        return await this._repository.findNome(nome);
    }

    // async criar(dados: any) {

    //     // cria pessoa
    //     const pessoa = Pessoa.criar(
    //         dados.nome,
    //         dados.tipo
    //     );

    //     const pessoaCriada = await this._repository.create(pessoa);

    //     const id_pessoa = pessoaCriada.insertId;


    //     switch (dados.tipo.toLowerCase()) {

    //         case "cliente":

    //             const cliente = Cliente.criar(
    //                 dados.data_nascimento,
    //                 id_pessoa
    //             );

    //             await this._clienteRepository.create(cliente);

    //             break;


    //         case "organizacao":

    //             const organizacao = Organizacao.criar(
    //                 dados.id_area_atuacao,
    //                 dados.data_criacao,
    //                 id_pessoa,
    //                 dados.cpf ?? null,
    //                 dados.cnpj ?? null
    //             );

    //             await await this._organizacaoRepository.create({
    //                 cpf: organizacao.Cpf ?? null,
    //                 cnpj: organizacao.Cnpj ?? null,
    //                 data_criacao: organizacao.DataCriacao,
    //                 id_area_atuacao: organizacao.IdAreaAtuacao,
    //                 id_pessoa: organizacao.IdPessoa
    //             });

    //             break;

    //         default:
    //             throw new Error("Tipo inválido");

    //     }


    //     return {
    //         message: "Pessoa criada com sucesso",
    //         id_pessoa
    //     };

    // }

    async criar(nome: string, tipo: string, infoExtra: any) {
        const pessoa = Pessoa.criar(nome, tipo);
        return await this._repository.create(pessoa, infoExtra);
    }

    async editar(id: number, nome: string, infoExtra: any) {
        const pessoa = Pessoa.editar(nome, id);
        return await this._repository.update(pessoa, infoExtra)
    }

    async selecionaTodosClientes() {
        return await this._repository.findClientes();
    }

    async selecionaTodaOrganizacao() {
        return await this._repository.findOrganizacao();
    }
}