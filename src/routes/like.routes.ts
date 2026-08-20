import { Router } from "express";

import { LikeController }
    from "../controllers/like.controller";

import { AuthMiddleware }
    from "../middleware/AuthMiddleware";

const likeRoutes = Router();

const controller =
    new LikeController();

const authMiddleware =
    new AuthMiddleware();


likeRoutes.post(
    "/likes/toggle",
    authMiddleware.authenticate,
    controller.toggle
);


likeRoutes.get(
    "/likes/verificar",
    authMiddleware.authenticate,
    controller.verificarLike
);


likeRoutes.get(
    "/likes/meus",
    authMiddleware.authenticate,
    controller.meusLikes
);


likeRoutes.get(
    "/likes/post",
    controller.selecionaByPost
);


likeRoutes.get(
    "/likes/contar",
    controller.contarLikes
);


export default likeRoutes;