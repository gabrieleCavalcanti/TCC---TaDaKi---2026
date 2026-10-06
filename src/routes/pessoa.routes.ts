import { Router } from "express";
import { PessoaController } from "../controllers/pessoa.controller";
import { AuthMiddleware } from "../middleware/AuthMiddleware";


const pessoaRoutes = Router();
const pessoaController = new PessoaController();
const authMiddleware = new AuthMiddleware();

pessoaRoutes.get('/pessoas',authMiddleware.authenticate, pessoaController.selecionaTodos);
pessoaRoutes.post('/pessoas', pessoaController.criar);
pessoaRoutes.patch('/pessoas', authMiddleware.authenticate, pessoaController.editar);

export default pessoaRoutes;

