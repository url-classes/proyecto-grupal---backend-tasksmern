import express from "express";
const router = express.Router();
import {
  registrar,
  actualizar,
  eliminar,
  dataTareas,

} from "../controllers/tareaController.js";
import checkAuth from "../middleware/authMiddleware.js"


//area privada
//router.post("/registrar" ,checkAuth,registrar);
//router.post("/actualizar" ,checkAuth,actualizar);
//router.delete("/eliminar" ,checkAuth,eliminar);
//esto es solo para pruebas
router.post("/registrar" ,registrar);
router.patch("/actualizar" ,actualizar);
router.delete("/eliminar" ,eliminar);
router.get("/data" ,dataTareas);
export default router;