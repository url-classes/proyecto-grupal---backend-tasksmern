import Proyecto from "../models/Proyecto.js";
import Tareas from "../models/Tareas.js";


const crearTarea = async (req, res) => {
  const { proyecto } = req.body;
  //buscamos si el proyecto existe
  const existeProyecto = await Proyecto.findById(proyecto);

  if (!existeProyecto) {
    const error = new Error("El Proyecto no existe");
    return res.status(404).json({ msg: error.message });
  }

  // determinar si es el creador del proyecto
  if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes los permisos para añadir tareas");
    return res.status(403).json({ msg: error.message });
  }

  try {
    const tareaAlmacenada = await Tareas.create(req.body);
    // Almacenar el ID en el proyecto
    existeProyecto.tareas.push(tareaAlmacenada._id);
    await existeProyecto.save();
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};




const actualizar = async (req, res) => {
  const { id } = req.params;
  // prevenir tareas duplicadas
  console.log(id)
  const tarea =  await Tareas.findById(id);
  console.log(tarea.creador_id.toString())
  console.log(req.body.creador_id)
  if (!tarea) {
    const error = new Error("La tarea no existe");
    return res.status(400).json({ msg: error.message });
  }
  if (tarea.creador_id.toString() !== req.body.creador_id.toString()) {
    const error = new Error("Sin permiso de Modificar la tarea");
    return res.status(403).json({msg: error.message});
  }

  tarea.nombre = req.body.nombre || tarea.nombre;
  tarea.descripcion = req.body.descripcion || tarea.descripcion;
  tarea.estado=req.body.estado || tarea.estado;
  tarea.responsables = req.body.responsables || tarea.responsables;
  tarea.fechaEntrega = req.body.cliente || tarea.fechaEntrega;
  tarea.prioridad = req.body.prioridad || tarea.prioridad;
  tarea.proyecto = req.body.proyecto || tarea.proyecto;

  try {
    const tareaActualizada = await tarea.save();
    res.json(tareaActualizada)
  } catch (error) {
    console.log(error);
  }
};

const eliminar = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ msg: error.message });
  }

  try {
    const proyecto = await Proyecto.findById(tarea.proyecto);
    proyecto.tareas.pull(tarea._id);
    await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()]);
    res.json({ msg: "La Tarea se eliminó" });
  } catch (error) {
    console.log(error);
  }
};

const dataTareas = async (req, res) => {
  const {id } = req.params;
  
   const tareas =  await Tareas.find({"proyecto":id});
  if(tareas.length==0){
    const error = new Error("El proyecto no tiene tareas aun ");
    return res.status(400).json({ msg: error.message });
  }
  
  try {

    res.json(tareas)
  } catch (error) {
    console.log(error);
  }
 
};

export {
  crearTarea,
  actualizar,
  eliminar,
  dataTareas,
};
