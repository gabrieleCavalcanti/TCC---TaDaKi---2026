
import { Request, Response } from "express";
import { FavoritoService } from "../services/favoritos.service";

export class FavoritoController {
  constructor(private _service = new FavoritoService()) {}

  buscarFavorito = async (req: Request, res: Response) => {
    try {
      const id = req.query.id;
      const id_cliente = req.query.id_cliente;
      const id_organizacao = req.query.id_organizacao;

      // Buscar pelo ID do favorito
      if (id !== undefined) {
        const id_favorito = Number(id);

        if (!Number.isInteger(id_favorito) || id_favorito < 1) {
          return res.status(400).json({
            message: "ID do favorito inválido",
          });
        }

        const favorito = await this._service.selecionaId(id_favorito);

        if (favorito.length === 0) {
          return res.status(404).json({
            message: "Favorito não encontrado",
          });
        }

        return res.status(200).json({ favorito });
      }

      // Buscar pelo ID do cliente
      if (id_cliente !== undefined) {
        const idCliente = Number(id_cliente);

        if (!Number.isInteger(idCliente) || idCliente < 1) {
          return res.status(400).json({
            message: "ID do cliente inválido",
          });
        }

        const favoritos =
          await this._service.selecionaIdCliente(idCliente);

        return res.status(200).json({ favoritos });
      }

      // Buscar pelo ID da organização
      if (id_organizacao !== undefined) {
        const idOrganizacao = Number(id_organizacao);

        if (!Number.isInteger(idOrganizacao) || idOrganizacao < 1) {
          return res.status(400).json({
            message: "ID da organização inválido",
          });
        }

        const favoritos =
          await this._service.selecionaIdOrg(idOrganizacao);

        return res.status(200).json({ favoritos });
      }

      // Buscar todos os favoritos
      const resultadoSelecionaTodos =
        await this._service.selecionaTodos();

      return res.status(200).json({ resultadoSelecionaTodos });
    } catch (error: unknown) {
      console.error(error);

      return res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage:
          error instanceof Error
            ? error.message
            : "Erro desconhecido",
      });
    }
  };

  criar = async (req: Request, res: Response) => {
    try {
      const id_cliente = Number(req.body.id_cliente);
      const id_organizacao = Number(req.body.id_organizacao);

      if (
        !Number.isInteger(id_cliente) ||
        id_cliente < 1 ||
        !Number.isInteger(id_organizacao) ||
        id_organizacao < 1
      ) {
        return res.status(400).json({
          message: "Digite IDs válidos",
        });
      }

      const resultadoCliente =
        await this._service.selecionaIdCliente(id_cliente);

      const resultadoOrg =
        await this._service.selecionaIdOrg(id_organizacao);

      // Atenção: essas consultas retornam favoritos existentes.
      // Elas não comprovam que cliente e organização existem.
      // A validação definitiva deve consultar as tabelas correspondentes.

      const jaFavoritado = resultadoCliente.some(
        (favorito: any) =>
          Number(favorito.id_organizacao) === id_organizacao,
      );

      if (jaFavoritado) {
        return res.status(409).json({
          message: "Esta organização já está nos favoritos",
        });
      }

      const novoRegistro = await this._service.criar(
        id_cliente,
        id_organizacao,
      );

      return res.status(201).json({
        message: "Organização favoritada com sucesso!",
        novoRegistro,
      });
    } catch (error: unknown) {
      console.error(error);

      return res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage:
          error instanceof Error
            ? error.message
            : "Erro desconhecido",
      });
    }
  };

  deletar = async (req: Request, res: Response) => {
    try {
      const id_favorito = Number(req.params.id_favorito);

      if (!Number.isInteger(id_favorito) || id_favorito < 1) {
        return res.status(400).json({
          message: "ID do favorito inválido",
        });
      }

      const resultadoSelecionaId =
        await this._service.selecionaId(id_favorito);

      if (resultadoSelecionaId.length === 0) {
        return res.status(404).json({
          message: "Não há dados com o ID pesquisado",
        });
      }

      const deletado = await this._service.deletar(id_favorito);

      return res.status(200).json({
        message: "Favorito excluído com sucesso!",
        deletado,
      });
    } catch (error: unknown) {
      console.error(error);

      return res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage:
          error instanceof Error
            ? error.message
            : "Erro desconhecido",
      });
    }
  };
}
