import { Router } from "express";
import { AreaAtuacaoController } from "../controllers/areaAtuacao.controller";

const areaAtuacaoController = new AreaAtuacaoController();
const areaAtuacaoRoutes = Router();

areaAtuacaoRoutes.get('/AreaAtuacao', areaAtuacaoController.buscarArea)
areaAtuacaoRoutes.get('/BuscarArea', areaAtuacaoController.buscarPorDescricao)
areaAtuacaoRoutes.post('/AreaAtuacao', areaAtuacaoController.criar)
areaAtuacaoRoutes.patch('/AreaAtuacao/:id_area_atuacao', areaAtuacaoController.editar)

export default areaAtuacaoRoutes;
