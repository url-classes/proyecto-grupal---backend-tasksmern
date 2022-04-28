import express from "express";
import {
  crearChat,
  chatsUsuario,
  crearChatGrupal,
  renombrarChat,
  agregarUserGrupo,
  eliminarUserGrupo,
} from "../controllers/chatController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(checkAuth, crearChat);
router.route("/").get(checkAuth, chatsUsuario);
router.route("/crearGrupal").post(checkAuth, crearChatGrupal);
router.route("/renombrarChatGrupal").put(checkAuth, renombrarChat);
router.route("/agregarUserGrupo").put(checkAuth, agregarUserGrupo);
router.route("/eliminarUserGrupo").put(checkAuth, eliminarUserGrupo);

export default router;
