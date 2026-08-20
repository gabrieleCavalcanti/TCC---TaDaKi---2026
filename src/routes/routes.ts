import { Router } from "express";
import areaAtuacaoRoutes from "./areaAtuacao.routes";
import avaliacaoRoutes from "./avaliacao.routes";
import categoriaRoutes from "./categoria.routes";
import contatoRoutes from "./contato.routes";
import enderecoRoutes from "./endereco.routes";
import favoritoRoutes from "./favorito.routes";
import likeRoutes from "./like.routes";
import pessoaRoutes from "./pessoa.routes";
import postRoutes from "./post.routes";
import authRoutes from "./AuthRoutes";


const router = Router();
router.use("/", authRoutes);

router.use('/', areaAtuacaoRoutes);
router.use('/', avaliacaoRoutes);
router.use('/', categoriaRoutes);
router.use('/', contatoRoutes);
router.use('/', enderecoRoutes);
router.use('/', favoritoRoutes);
router.use('/', likeRoutes);
router.use('/', pessoaRoutes);
router.use('/', postRoutes);


export default router;