import type { Request, Response } from "express";
import { FavoritoService } from "../services/favoritos.service";
export class FavoritoController {
  constructor(private _service = new FavoritoService()) {}
  private async client(req: Request, res: Response) {
    if (!req.user) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return null;
    }
    if (String(req.user.tipo).toUpperCase() !== "CLIENTE") {
      res
        .status(403)
        .json({ message: "Apenas clientes podem gerenciar favoritos." });
      return null;
    }
    const id = await this._service.clienteDaPessoa(req.user.id_login);
    if (!id)
      res
        .status(403)
        .json({ message: "Cliente não encontrado para sua conta." });
    return id;
  }
  private failure(res: Response, error: unknown) {
    if ((error as { code?: string }).code === "ER_BAD_FIELD_ERROR")
      return res
        .status(503)
        .json({
          message:
            "Aplique a migração 001_favoritos_data.sql para habilitar os favoritos.",
        });
    console.error(error);
    return res
      .status(500)
      .json({ message: "Não foi possível atualizar os favoritos." });
  }
  buscarFavorito = async (req: Request, res: Response) => {
    try {
      const client = await this.client(req, res);
      if (!client) return;
      return res.json({
        resultadoSelecionaTodos: await this._service.selecionaTodos(
          req.user!.id_login,
        ),
      });
    } catch (error) {
      return this.failure(res, error);
    }
  };
  criar = async (req: Request, res: Response) => {
    try {
      const client = await this.client(req, res);
      if (!client) return;
      if (
        req.body.id_cliente !== undefined &&
        Number(req.body.id_cliente) !== client
      )
        return res
          .status(403)
          .json({ message: "Você só pode favoritar com sua própria conta." });
      const org = Number(req.body.id_organizacao);
      if (!Number.isSafeInteger(org) || org < 1)
        return res.status(400).json({ message: "Organização inválida." });
      if (!(await this._service.selecionaIdOrg(org)).length)
        return res.status(404).json({ message: "Organização não encontrada." });
      const existing = await this._service.existing(client, org);
      if (existing.length)
        return res
          .status(200)
          .json({
            novoRegistro: { insertId: existing[0].id_favorito },
            id_favorito: existing[0].id_favorito,
          });
      const novoRegistro = await this._service.criar(client, org);
      return res
        .status(201)
        .json({ message: "Organização favoritada", novoRegistro });
    } catch (error) {
      return this.failure(res, error);
    }
  };
  deletar = async (req: Request, res: Response) => {
    try {
      const client = await this.client(req, res);
      if (!client) return;
      const id = Number(req.params.id_favorito);
      if (!Number.isSafeInteger(id) || id < 1)
        return res.status(400).json({ message: "ID inválido." });
      const existing = await this._service.selecionaId(id);
      if (!existing.length)
        return res.status(404).json({ message: "Favorito não encontrado." });
      if (Number(existing[0].id_cliente) !== client)
        return res
          .status(403)
          .json({ message: "Esse favorito pertence a outra conta." });
      return res.json({
        message: "Favorito removido",
        deletado: await this._service.deleteOwned(
          Number(existing[0].id_organizacao),
          client,
        ),
      });
    } catch (error) {
      return this.failure(res, error);
    }
  };
}
