import { Router } from "express";
import { CategoriaController } from "../controllers/categoria.controller";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

const categoriaRoutes = Router();
const controller = new CategoriaController();
const authMiddleware = new AuthMiddleware();

categoriaRoutes.get( "/categorias", authMiddleware.authenticate, controller.selecionarTodos);
categoriaRoutes.post("/categorias", authMiddleware.authenticate, controller.criar);
categoriaRoutes.put("/categorias", authMiddleware.authenticate, controller.editar);
categoriaRoutes.get("/categorias/id", authMiddleware.authenticate, controller.selecionaById);
categoriaRoutes.get("/categorias/buscar", authMiddleware.authenticate, controller.selecionaByNome);

export default categoriaRoutes;
