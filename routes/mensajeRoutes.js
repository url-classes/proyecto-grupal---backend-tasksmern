import express from "express";
import {
  obtenerMensajes,
  enviarMensaje,
} from "../controllers/mensajeController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(checkAuth, enviarMensaje);
router.route("/:chatId").get(checkAuth, obtenerMensajes);

export default router;
