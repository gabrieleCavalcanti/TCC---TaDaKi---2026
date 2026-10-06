import { Router } from "express";
import { AreaAtuacaoController } from "../controllers/areaAtuacao.controller";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

const areaAtuacaoRoutes = Router();
const areaAtuacaoController = new AreaAtuacaoController();
const authMiddleware = new AuthMiddleware();

areaAtuacaoRoutes.get('/AreaAtuacao', areaAtuacaoController.buscarArea)
areaAtuacaoRoutes.get('/BuscarArea', areaAtuacaoController.buscarPorDescricao)
areaAtuacaoRoutes.post('/AreaAtuacao', authMiddleware.authenticate, areaAtuacaoController.criar)
areaAtuacaoRoutes.patch('/AreaAtuacao/:id_area_atuacao', authMiddleware.authenticate, areaAtuacaoController.editar)

export default areaAtuacaoRoutes;