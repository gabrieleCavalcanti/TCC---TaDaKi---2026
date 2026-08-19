import { Router } from "express";
import { AvaliacaoController } from "../controllers/avaliacao.controller";

const avaliacaoController = new AvaliacaoController();
const avaliacaoRoutes = Router();

avaliacaoRoutes.get('/Avaliacao', avaliacaoController.buscarAvaliacao)
avaliacaoRoutes.post('/Avaliacao', avaliacaoController.criar)
avaliacaoRoutes.delete('/Avaliacao/:id_avaliacao', avaliacaoController.deletar)

export default avaliacaoRoutes;