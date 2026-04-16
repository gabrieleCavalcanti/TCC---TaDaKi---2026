import { Router } from "express";
import areaAtuacaoRoutes from "./areaAtuacao.routes";
import avaliacaoRoutes from "./avaliacao.routes";
import categoriaRoutes from "./categoria.routes";
import clienteRoutes from "./cliente.routes";
import contatoRoutes from "./contato.routes";
import enderecoRoutes from "./endereco.routes";
import favoritoRoutes from "./favorito.routes";
import likeRoutes from "./like.routes";
import loginRoutes from "./login.routes";
import organizacaoRoutes from "./organizacao.routes";
import pessoaRoutes from "./pessoa.routes";
import postRoutes from "./post.routes";


const router = Router();

router.use('/', areaAtuacaoRoutes);
router.use('/', avaliacaoRoutes);
router.use('/', categoriaRoutes);
router.use('/', clienteRoutes);
router.use('/', contatoRoutes);
router.use('/', enderecoRoutes);
router.use('/', favoritoRoutes);
router.use('/', likeRoutes);
router.use('/', loginRoutes);
router.use('/', organizacaoRoutes);
router.use('/', pessoaRoutes);
router.use('/', postRoutes);


export default router;