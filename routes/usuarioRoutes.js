import express from "express";
const router = express.Router();
import {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
} from "../controllers/usuarioController.js";
import checkAuth from "../middleware/authMiddleware.js"

// area publica
router.post("/", registrar);
router.get("/confirmar/:token", confirmar);
router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword)
// ESTO ES UNA FORMA PARA PODER CREAR LOS ROUTERS AYUDARIA A DOCUMENTAR CON SWAGEER
// router.get("/olvide-password/:token", comprobarToken)
// router.post("/olvide-password/:token", nuevoPassword)

// ESTA ES OTRA FORMA SIMPLIFICADA
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

//area privada
router.get("/perfil", checkAuth ,perfil);
export default router;
