import { Router } from "express";
import { CategoriaController } from "../controllers/categoria.controller";

const categoriaRoutes = Router();
const controller = new CategoriaController();

categoriaRoutes.get( "/categorias",controller.selecionarTodos);
categoriaRoutes.post("/categorias",controller.criar);
categoriaRoutes.put("/categorias",controller.editar);
categoriaRoutes.get("/categorias/id",controller.selecionaById);
categoriaRoutes.get("/categorias/buscar",controller.selecionaByNome);

export default categoriaRoutes;
