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
// import { EmailService } from "../services/email.service";




const router = Router();
// const emailService = new EmailService();

// router.get("/teste-email", async (req, res) => {
//     try {
//         await emailService.enviarEmail(
//             "helenandradee0807@gmail.com",
//             "Teste de e-mail - TaDaKi",
//             "Este é um teste de envio de e-mail do projeto TaDaKi."
//         );

//         return res.status(200).json({
//             message: "E-mail enviado com sucesso"
//         });

//     } catch (error) {
//         console.error("Erro ao enviar e-mail:", error);

//         return res.status(500).json({
//             message: "Erro ao enviar e-mail"
//         });
//     }
// });

router.use("/auth", authRoutes);

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