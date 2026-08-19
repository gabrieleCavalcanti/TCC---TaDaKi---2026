import { Router } from "express";
import { FavoritoController } from "../controllers/favorito.controller";

const favoritoController = new FavoritoController();
const favoritoRoutes =Router();

favoritoRoutes.get('/Favoritos', favoritoController.buscarFavorito)
favoritoRoutes.post('/Favoritos', favoritoController.criar)
favoritoRoutes.delete('/Favoritos/:id_favorito', favoritoController.deletar)

export default favoritoRoutes;