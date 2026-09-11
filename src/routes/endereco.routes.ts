import { Router } from "express";

import { EnderecoController } from "../controllers/endereco.controller";

const enderecoRoutes = Router();

const controller = new EnderecoController();

enderecoRoutes.get("/enderecos", controller.selecionarTodos);
enderecoRoutes.post("/enderecos", controller.criar);
enderecoRoutes.put("/enderecos", controller.editar);

export default enderecoRoutes;

