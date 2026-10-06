import { Router } from "express";

import { PostController } from "../controllers/post.controller";
import uploadImage from "../middlewares/uploadImage.middleware";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { verificarOrganizacao } from "../middleware/TipoUsuarioMiddleware";

const postRoutes = Router();

const controller = new PostController();
const authMiddleware = new AuthMiddleware();

postRoutes.get("/posts", authMiddleware.authenticate, controller.selecionarTodos);
postRoutes.post("/posts",authMiddleware.authenticate,verificarOrganizacao, uploadImage,controller.criar,);
postRoutes.put("/posts", authMiddleware.authenticate, verificarOrganizacao, uploadImage, controller.editar,);
postRoutes.delete("/posts",authMiddleware.authenticate,verificarOrganizacao,controller.arquivar,);
postRoutes.get("/posts/id", authMiddleware.authenticate, controller.selecionaById);
postRoutes.get("/posts/categoria", authMiddleware.authenticate, controller.selecionaByCategoria);
postRoutes.get("/posts/organizacao", authMiddleware.authenticate, controller.selecionaByOrganizacao);

export default postRoutes;

// import { Router } from "express";
// import { PostController } from "../controllers/post.controller";
// import uploadImage from "../middlewares/uploadImage.middleware";

// const postRoutes = Router();
// const controller = new PostController();

// postRoutes.get( "/posts", controller.selecionarTodos);
// postRoutes.post( "/posts", uploadImage, controller.criar); // apenas organização
// postRoutes.put( "/posts", uploadImage, controller.editar); // apenas organização
// postRoutes.delete( "/posts", controller.arquivar); // apenas organização
// postRoutes.get( "/posts/id", controller.selecionaById);
// postRoutes.get( "/posts/categoria", controller.selecionaByCategoria);
// postRoutes.get( "/posts/organizacao", controller.selecionaByOrganizacao);

// export default postRoutes;
