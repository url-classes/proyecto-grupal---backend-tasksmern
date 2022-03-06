import express from "express";
import {
  crearProyecto,
  obtenerProyecto,
  obtenerTodosLosProyectos
} from "../controllers/proyectosController.js";
const router = express.Router();

router.post("/", crearProyecto);
router.get("/:id", obtenerProyecto);
// requerira permisos de admin
router.get("/", obtenerTodosLosProyectos);

export default router;