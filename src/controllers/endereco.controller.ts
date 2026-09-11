import { Request, Response } from "express";
import { EnderecoService } from "../services/endereco.service";

export class EnderecoController {
  constructor(private _service = new EnderecoService()) {}

  // selecionarTodos = async (req: Request, res: Response) => {
  //     try {
  //         const enderecos = await this._service.selecionarTodos();

  //         return res.status(200).json({ enderecos });

  //     } catch (error: unknown) {
  //         console.error(error);

  //         return res.status(500).json({
  //             message: "Ocorreu um erro no servidor"
  //         });
  //     }
  // };

  selecionarTodos = async (req: Request, res: Response) => {
    try {
      const id = req.query.id;
      const municipio = req.query.municipio;
      const cep = req.query.cep;
      const id_pessoa = req.query.id_pessoa;

      let paramDup = null;

      if (
        (id && municipio) ||
        (id && cep) ||
        (id && id_pessoa) ||
        (municipio && cep) ||
        (municipio && id_pessoa) ||
        (cep && id_pessoa)
      ) {
        paramDup =
          "Mais de um parâmetro informado, prioridade: ID > MUNICIPIO > CEP > ID_PESSOA";
      }

      // ID DO ENDEREÇO
      if (id) {
        const id_endereco = Number(id);

        if (!id_endereco || id_endereco <= 0) {
          return res.status(400).json({
            message: "ID do endereço inválido",
          });
        }

        const enderecoId = await this._service.selecionaById(id_endereco);

        if (enderecoId.length === 0) {
          return res.status(404).json({
            message: "Endereço não localizado",
          });
        }

        return res.status(200).json({
          enderecoId,
          paramDuplicado: paramDup,
        });
      }

      // MUNICÍPIO
      if (municipio) {
        const municipioEndereco = String(municipio);

        // precisa criar esse método no service/repository
        const enderecosMunicipio =
          await this._service.selecionaByMunicipio(municipioEndereco);

        if (enderecosMunicipio.length === 0) {
          return res.status(404).json({
            message: "Nenhum endereço localizado",
          });
        }

        return res.status(200).json({
          enderecosMunicipio,
          paramDuplicado: paramDup,
        });
      }

      // CEP
      if (cep) {
        const cepEndereco = String(cep);

        // precisa criar esse método no service/repository
        const enderecosCep = await this._service.selecionaByCep(cepEndereco);

        if (enderecosCep.length === 0) {
          return res.status(404).json({
            message: "Nenhum endereço localizado",
          });
        }

        return res.status(200).json({
          enderecosCep,
          paramDuplicado: paramDup,
        });
      }

      // ID DA PESSOA
      if (id_pessoa) {
        const pessoaId = Number(id_pessoa);

        if (!pessoaId || pessoaId <= 0) {
          return res.status(400).json({
            message: "ID da pessoa inválido",
          });
        }

        const enderecoPessoa = await this._service.selecionaByPessoa(pessoaId);

        if (enderecoPessoa.length === 0) {
          return res.status(404).json({
            message: "Nenhum endereço encontrado para esta pessoa",
          });
        }

        return res.status(200).json({
          enderecoPessoa,
          paramDuplicado: paramDup,
        });
      }

      // TODOS
      const enderecos = await this._service.selecionarTodos();

      return res.status(200).json({
        enderecos,
      });
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof Error) {
        return res.status(500).json({
          message: "Ocorreu um erro no servidor",
          errorMessage: error.message,
        });
      }

      return res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: "Erro Desconhecido",
      });
    }
  };

  criar = async (req: Request, res: Response) => {
    try {
      const { rua, numero, bairro, municipio, cep, uf, id_pessoa } = req.body;

      if (!rua || String(rua).trim() === "") {
        return res.status(400).json({
          message: "A rua é obrigatória",
        });
      }

      if (!numero || String(numero).trim() === "") {
        return res.status(400).json({
          message: "O número é obrigatório",
        });
      }

      if (!bairro || String(bairro).trim() === "") {
        return res.status(400).json({
          message: "O bairro é obrigatório",
        });
      }

      if (!municipio || String(municipio).trim() === "") {
        return res.status(400).json({
          message: "O município é obrigatório",
        });
      }

      if (!cep || String(cep).trim() === "") {
        return res.status(400).json({
          message: "O CEP é obrigatório",
        });
      }

      if (!uf || String(uf).trim() === "") {
        return res.status(400).json({
          message: "A UF é obrigatória",
        });
      }

      if (!id_pessoa || Number(id_pessoa) <= 0) {
        return res.status(400).json({
          message: "ID da pessoa inválido",
        });
      }

      const novo = await this._service.criar({
        rua: String(rua),
        numero: String(numero),
        bairro: String(bairro),
        municipio: String(municipio),
        cep: String(cep),
        uf: String(uf),
        id_pessoa: Number(id_pessoa),
      });

      return res.status(201).json({
        message: "Endereço criado com sucesso",
        novo,
      });
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof Error) {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Ocorreu um erro no servidor",
      });
    }
  };

  editar = async (req: Request, res: Response) => {
    try {
      const id_endereco = Number(req.query.id);

      if (!id_endereco || id_endereco <= 0) {
        return res.status(400).json({
          message: "ID do endereço inválido",
        });
      }

      const { rua, numero, bairro, municipio, cep, uf, id_pessoa } = req.body;

      if (!rua || String(rua).trim() === "") {
        return res.status(400).json({
          message: "A rua é obrigatória",
        });
      }

      if (!numero || String(numero).trim() === "") {
        return res.status(400).json({
          message: "O número é obrigatório",
        });
      }

      if (!bairro || String(bairro).trim() === "") {
        return res.status(400).json({
          message: "O bairro é obrigatório",
        });
      }

      if (!municipio || String(municipio).trim() === "") {
        return res.status(400).json({
          message: "O município é obrigatório",
        });
      }

      if (!cep || String(cep).trim() === "") {
        return res.status(400).json({
          message: "O CEP é obrigatório",
        });
      }

      if (!uf || String(uf).trim() === "") {
        return res.status(400).json({
          message: "A UF é obrigatória",
        });
      }

      if (!id_pessoa || Number(id_pessoa) <= 0) {
        return res.status(400).json({
          message: "ID da pessoa inválido",
        });
      }

      const alterado = await this._service.editar(id_endereco, {
        rua: String(rua),
        numero: String(numero),
        bairro: String(bairro),
        municipio: String(municipio),
        cep: String(cep),
        uf: String(uf),
        id_pessoa: Number(id_pessoa),
      });

      return res.status(200).json({
        message: "Endereço alterado com sucesso",
        alterado,
      });
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof Error) {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Ocorreu um erro no servidor",
      });
    }
  };
}
