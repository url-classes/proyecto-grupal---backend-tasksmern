import express from "express";
import {
  crearProyecto,
  obtenerProyecto,
  obtenerTodosLosProyectos
} from "../controllers/proyectosController.js";
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Proyecto:
 *      type: object
 *      properties:
 *        nombre:
 *          type: string
 *          description: Nombre del proyecto
 *        descripcion:
 *          type: string
 *          description: Descripcion de proyecto
 *        fechaEntrega:
 *          type: string
 *          format: date-time
 *          description: Fecha de entrega (Por default toma date-time.now)
 *        cliente:
 *          type: string
 *          description: El nombre del cliente para quien se desarrolla el proyecto
 *        creador:
 *          type: string
 *          description: El ObjectId del creador del proyecto
 *        colaboradores:
 *          type: array
 *          items:
 *            type: string
 *            description: El ObjectId de un participante del proyecto
 *        tareas:
 *          type: array
 *          items:
 *            type: string
 *            description: El ObjectId de una tarea del proyecto
 *      required:
 *        - nombre
 *        - descripcion
 *        - cliente
 *        - creador
 *      example:
 *        nombre: Proyecto de ejemplo
 *        descripcion: Esta es la descripcion del proyecto de ejemplo
 *        fechaEntrega: 2022-03-05T23:04:18.562+00:00
 *        cliente: Empresa de ejemplo
 *        creador: 62238fc5dc0e89276b3fd1fd
 *        colaboradores: ["622396ebe7b215058157c79c","6223a796ff2b02b3892a8554"]
 *        tareas: ["622396ebe7b215058157c79c","6223a796ff2b02b3892a8554"]
 */

/**
 * @swagger
 * /api/proyectos:
 *  post:
 *    summary: Endpoint creado para agregar un nuevo proyecto
 *    tags: [Proyecto]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Proyecto'
 *    responses:
 *      200:
 *        description: Nuevo proyecto creado correctamente
 */
router.post("/", crearProyecto);

/**
 * @swagger
 * /api/proyectos/{id}:
 *  get:
 *    summary: Endpoint creado para obtener un proyecto mediante su ObjectId
 *    tags: [Proyecto]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:   
 *          type: string
 *        required: true
 *        description: ObjectId del proyecto
 *    responses:
 *      200:
 *        description: displaying matching user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Proyecto'
 *      404:
 *        description: Proyecto no encontrado
 */
router.get("/:id", obtenerProyecto);

// requerira permisos de admin
/**
 * @swagger
 * /api/proyectos:
 *  get:
 *    summary: Endpoint creado para obtener todos los proyectos existentes
 *    tags: [Proyecto]
 *    responses:
 *      200:
 *        description: Mostrando users
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items: 
 *                $ref: '#/components/schemas/Proyecto'
 */
router.get("/", obtenerTodosLosProyectos);

export default router;