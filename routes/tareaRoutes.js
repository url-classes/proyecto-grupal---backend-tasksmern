import express from "express";
const router = express.Router();
import {
  crearTarea,
  actualizar,
  eliminar,
  dataTareas,

} from "../controllers/tareaController.js";
import checkAuth from "../middleware/authMiddleware.js"

//Configuracion de swagger


/**
 * @swagger
 * components:
 *  schemas:
 *    Tareas:
 *      type: object
 *      properties:
 *        nombre:
 *          type: string
 *          description: Nombre de la tarea
 *        descripcion:
 *          type: string
 *          description: Descripcion de la tarea
 *        estado:
 *          type: boolean
 *          description: Estado de la tarea
 *        fechaEntrega:
 *          type: Date
 *          description: Fecha de entrega (Por default toma date-time.now)
 *        prioridad:
 *          type: string
 *          description: La prioridad de la tarea(Puede ser baja, media, alta)
 *        proyecto:
 *          type: string
 *          description: El ObjectId del proyecto
 *        creador_id:
 *          type: string
 *          description: El ObjectId del creador de la tarea
 *        responsables:
 *          type: array
 *          items:
 *            type: string
 *            description: El ObjectId de un participante del proyecto
 *      required:
 *        - nombre
 *        - fechaEntrega
 *        - prioridad
 *        - proyecto
 *        - creador_id
 *      example:
 *        nombre: Tarea de prueba
 *        descripcion: Breve explicacion de la tarea
 *        fechaEntrega: 2022-03-06T06:09:37.381Z
 *        creador_id: 622396ebe7b215058157c79c
 *        proyecto: 62238fc5dc0e89276b3fd1fd
 *        responsables: ["622396ebe7b215058157c79c","6223a796ff2b02b3892a8554"]
 */




//configuracion de swagger



//area privada
//router.post("/registrar" ,checkAuth,registrar);
//router.patch("/actualizar" ,checkAuth,actualizar);
//router.delete("/eliminar" ,checkAuth,eliminar);
//router.get("/data" ,checkAuth,dataTareas);

//esto es solo para pruebas
router.post("/",checkAuth ,crearTarea);
/**
 * @swagger
 * /api/tareas/:
 *  post:
 *    summary: Endpoint para crear una tarea
 *    tags: [Tareas]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Tareas'
 *    responses:
 *      200:
 *        description: Tarea creada exitosamente
 */




router.put("/:id" ,checkAuth,actualizar);
/**
 * @swagger
 * /api/tareas/{id}:
 *  put:
 *    summary: Endpoint creado para actualizar los datos de una tarea
 *    tags: [Tareas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:   
 *          type: string
 *        required: true
 *        description: ObjectId de la tarea  a  actualizar
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Tareas'
 *              
 *    responses:
 *      200:
 *        description: Tarea actualizado correctamente
 *      404:
 *        description: Tarea no encontrado
 *      403:
 *        description: Falta colocar el token en el header / token no existe
 */



router.delete("/:id",checkAuth ,eliminar);
/**
 * @swagger
 * /api/tareas/{id}:
 *  delete:
 *    summary: Endpoint creado para eliminar una tarea en especifico
 *    description: Este endpoint tiene como requisito el id de la tarea y el id del usuario para verificar si tiene permisos para eliminarla
 *    tags: [Tareas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:   
 *          type: string
 *        required: true
 *        description: ObjectId de la tarea  a  actualizar
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Tareas'
 *              
 *    responses:
 *      200:
 *        description: Tarea eliminada correctamente
 *      404:
 *        description: Tarea no encontrada 
 *      403:
 *        description: Falta colocar el token en el header / token no existe
 */



router.get("/:id", checkAuth,dataTareas);
/**
 * @swagger
 * /api/tareas/{id}:
 *  get:
 *    summary: Endpoint creado para retornar las tareas de un proyecto en especifico
 *    tags: [Tareas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:   
 *          type: string
 *        required: true
 *        description: ObjectId del proyecto que se desea consultar
 *              
 *    responses:
 *      200:
 *        description: Tareas retornadas correctamente
 *      400:
 *        description:  No hay tareas en este proyecto
 *      403:
 *        description: Falta colocar el token en el header / token no existe
 */



export default router;