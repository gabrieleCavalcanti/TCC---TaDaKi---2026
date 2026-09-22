import { Router } from "express";

import { EnderecoController } from "../controllers/endereco.controller";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

const enderecoRoutes = Router();

const authMiddleware = new AuthMiddleware();
const controller = new EnderecoController();

enderecoRoutes.get("/enderecos", authMiddleware.authenticate, controller.selecionarTodos);
enderecoRoutes.post("/enderecos", authMiddleware.authenticate, controller.criar);
enderecoRoutes.put("/enderecos", authMiddleware.authenticate, controller.editar);

export default enderecoRoutes;

