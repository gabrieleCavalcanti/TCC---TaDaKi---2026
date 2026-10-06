import { Router } from "express";
import { AvaliacaoController } from "../controllers/avaliacao.controller";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { verificarCliente } from "../middleware/TipoUsuarioMiddleware";

const avaliacaoRoutes = Router();
const avaliacaoController = new AvaliacaoController();
const authMiddleware = new AuthMiddleware();

avaliacaoRoutes.get('/Avaliacao', authMiddleware.authenticate, avaliacaoController.buscarAvaliacao)
avaliacaoRoutes.post('/Avaliacao', authMiddleware.authenticate, verificarCliente, avaliacaoController.criar)
avaliacaoRoutes.delete('/Avaliacao/:id_avaliacao', authMiddleware.authenticate, verificarCliente, avaliacaoController.deletar)

export default avaliacaoRoutes;