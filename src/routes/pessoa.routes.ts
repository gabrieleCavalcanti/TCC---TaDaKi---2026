import { Router } from "express";
import { PessoaController } from "../controllers/pessoa.controller";

const pessoaController = new PessoaController();
const pessoaRoutes = Router();

pessoaRoutes.get('/pessoas', pessoaController.selecionaTodos);
pessoaRoutes.post('/pessoas', pessoaController.criar);
pessoaRoutes.patch('/pessoas', pessoaController.editar);

export default pessoaRoutes;