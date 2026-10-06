import { Router } from "express";
import { FavoritoController } from "../controllers/favorito.controller";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

const favoritoRoutes =Router();
const favoritoController = new FavoritoController();
const authMiddleware = new AuthMiddleware();

favoritoRoutes.get('/Favoritos', authMiddleware.authenticate, favoritoController.buscarFavorito)
favoritoRoutes.post('/Favoritos', authMiddleware.authenticate, favoritoController.criar)
favoritoRoutes.delete('/Favoritos/:id_favorito', authMiddleware.authenticate, favoritoController.deletar)

export default favoritoRoutes;
