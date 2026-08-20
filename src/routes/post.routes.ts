import { Router } from "express";

import { PostController } from "../controllers/post.controller";

import uploadImage from "../middlewares/uploadImage.middleware";

const postRoutes = Router();

const controller = new PostController();

postRoutes.get(
    "/posts",
    controller.selecionarTodos
);

postRoutes.post(
    "/posts",
    uploadImage,
    controller.criar
);

postRoutes.put(
    "/posts",
    uploadImage,
    controller.editar
);

postRoutes.delete(
    "/posts",
    controller.arquivar
);

postRoutes.get(
    "/posts/id",
    controller.selecionaById
);

postRoutes.get(
    "/posts/categoria",
    controller.selecionaByCategoria
);

postRoutes.get(
    "/posts/organizacao",
    controller.selecionaByOrganizacao
);

export default postRoutes;