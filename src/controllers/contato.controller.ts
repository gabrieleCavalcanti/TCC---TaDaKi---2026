import { Request, Response } from "express";
import { ContatoService } from "../services/contato.service";

export class ContatoController {
  constructor(private _service = new ContatoService()) {}

  selecionarTodos = async (req: Request, res: Response) => {
    try {
      const id = req.query.id;
      const id_pessoa = req.query.id_pessoa;
      const campo = req.query.campo;

      let paramDup = null;

      if (id && (id_pessoa || campo)) {
        paramDup =
          "Mais de um parâmetro informado, prioridade: ID > ID_PESSOA > CAMPO";
      } else if (id_pessoa && campo) {
        paramDup =
          "Mais de um parâmetro informado, prioridade: ID_PESSOA > CAMPO";
      }

      // BUSCAR POR ID DO CONTATO
      if (id) {
        const id_contato = Number(id);

        if (!id_contato || id_contato <= 0) {
          return res.status(400).json({
            message: "ID do contato inválido",
          });
        }

        const contatoId = await this._service.selecionaById(id_contato);

        if (contatoId.length === 0) {
          return res.status(404).json({
            message: "Contato não localizado",
          });
        }

        return res.status(200).json({
          contatoId,
          paramDuplicado: paramDup,
        });
      }

      // BUSCAR POR ID DA PESSOA BUSCAR CONTATOS POR ID DA PESSOA
      if (id_pessoa) {
        const pessoaId = Number(id_pessoa);

        if (!Number.isInteger(pessoaId) || pessoaId <= 0) {
          return res.status(400).json({
            message: "ID da pessoa inválido",
          });
        }

        // Se informou campo, validar
        if (campo && campo !== "telefone" && campo !== "email") {
          return res.status(400).json({
            message: "Campo inválido. Use telefone ou email",
          });
        }

        let contatoPessoa = await this._service.selecionaByPessoa(pessoaId);

        // Filtrar por telefone ou email, se solicitado
        if (campo === "telefone") {
          contatoPessoa = contatoPessoa.filter(
            (contato) => contato.telefone !== null,
          );
        } else if (campo === "email") {
          contatoPessoa = contatoPessoa.filter(
            (contato) => contato.email !== null,
          );
        }

        if (contatoPessoa.length === 0) {
          return res.status(404).json({
            message: campo
              ? `Nenhum ${campo} encontrado para esta pessoa`
              : "Nenhum contato encontrado para esta pessoa",
          });
        }

        return res.status(200).json({
          contatoPessoa,
          paramDuplicado: null,
        });
      }

      // BUSCAR SOMENTE TELEFONE OU EMAIL
      if (campo) {
        if (campo !== "telefone" && campo !== "email") {
          return res.status(400).json({
            message: "Campo inválido. Use telefone ou email",
          });
        }

        const resultado = await this._service.selecionarPorCampo(campo);

        return res.status(200).json({
          [campo]: resultado,
          paramDuplicado: paramDup,
        });
      }

      // BUSCAR TODOS OS CONTATOS
      const contatos = await this._service.selecionarTodos();

      return res.status(200).json({
        contatos,
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
        errorMessage: "Erro desconhecido",
      });
    }
  };

  criar = async (req: Request, res: Response) => {
    try {
      const { telefone, email, id_pessoa } = req.body;

      const temTelefone = telefone != null && String(telefone).trim() !== "";

      const temEmail = email != null && String(email).trim() !== "";

      // Exige exatamente um campo preenchido
      if (temTelefone === temEmail) {
        return res.status(400).json({
          message: "Informe somente um: telefone ou email",
        });
      }

      if (!id_pessoa || Number(id_pessoa) <= 0) {
        return res.status(400).json({
          message: "ID da pessoa inválido",
        });
      }

      const novo = await this._service.criar({
        telefone: temTelefone ? String(telefone).trim() : null,
        email: temEmail ? String(email).trim() : null,
        id_pessoa: Number(id_pessoa),
      });

      return res.status(201).json({
        message: "Contato criado com sucesso",
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
      const id_contato = Number(req.query.id);

      if (!id_contato || id_contato <= 0) {
        return res.status(400).json({
          message: "ID do contato inválido",
        });
      }

      const { telefone, email, id_pessoa } = req.body;

      const temTelefone = telefone != null && String(telefone).trim() !== "";

      const temEmail = email != null && String(email).trim() !== "";

      // Exige exatamente um campo preenchido
      if (temTelefone === temEmail) {
        return res.status(400).json({
          message: "Informe somente um: telefone ou email",
        });
      }

      if (!id_pessoa || Number(id_pessoa) <= 0) {
        return res.status(400).json({
          message: "ID da pessoa inválido",
        });
      }

      const alterado = await this._service.editar(id_contato, {
        telefone: temTelefone ? String(telefone).trim() : null,
        email: temEmail ? String(email).trim() : null,
        id_pessoa: Number(id_pessoa),
      });

      if (alterado.affectedRows === 0) {
        return res.status(404).json({
          message: "Contato não localizado",
        });
      }

      return res.status(200).json({
        message: "Contato alterado com sucesso",
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

  definirPrincipal = async (req: Request, res: Response) => {
    try {
      const id_contato = Number(req.query.id);
      const { id_pessoa } = req.body;

      if (
        !Number.isInteger(id_contato) ||
        id_contato <= 0 ||
        !Number.isInteger(Number(id_pessoa)) ||
        Number(id_pessoa) <= 0
      ) {
        return res.status(400).json({
          message: "ID do contato ou da pessoa inválido",
        });
      }

      const resultado = await this._service.definirPrincipal(
        id_contato,
        Number(id_pessoa),
      );

      if (!resultado) {
        return res.status(404).json({
          message: "Contato não encontrado para esta pessoa",
        });
      }

      return res.status(200).json({
        message: "Contato principal atualizado com sucesso",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Ocorreu um erro no servidor",
      });
    }
  };

  excluir = async (req: Request, res: Response) => {
    try {
      const id_contato = Number(req.query.id);

      if (!id_contato || id_contato <= 0) {
        return res.status(400).json({
          message: "ID do contato inválido",
        });
      }

      const excluido = await this._service.excluir(id_contato);

      if (excluido.affectedRows === 0) {
        return res.status(404).json({
          message: "Contato não localizado",
        });
      }

      return res.status(200).json({
        message: "Contato excluído com sucesso",
        excluido,
      });
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof Error) {
        return res.status(500).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Ocorreu um erro no servidor",
      });
    }
  };
}
