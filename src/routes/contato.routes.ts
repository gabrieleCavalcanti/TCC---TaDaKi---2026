import { Router } from "express";
import { ContatoController } from "../controllers/contato.controller";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

const contatoRoutes = Router();

const authMiddleware = new AuthMiddleware();
const controller = new ContatoController();

contatoRoutes.get("/contatos",authMiddleware.authenticate,controller.selecionarTodos,);
contatoRoutes.post("/contatos", authMiddleware.authenticate, controller.criar);
contatoRoutes.put("/contatos", authMiddleware.authenticate, controller.editar);
contatoRoutes.put(
  "/contatos/principal",
  authMiddleware.authenticate,
  controller.definirPrincipal
);
contatoRoutes.delete("/contatos",authMiddleware.authenticate, controller.excluir);

export default contatoRoutes;
