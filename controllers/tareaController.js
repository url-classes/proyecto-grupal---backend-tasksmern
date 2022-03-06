
import Tareas from "../models/Tareas.js";


const registrar = async (req, res) => {
  const { nombre,proyecto } = req.body;

  // prevenir tareas duplicadas
  const existeTarea =  await Tareas.findOne({proyecto: { $eq: proyecto} ,nombre: { $eq: nombre}});

  if (existeTarea) {
    const error = new Error("La tarea ya existe");
    return res.status(400).json({ msg: error.message });
  }

  try {
    // GUardar tareas
    const tareas = new Tareas(req.body);
    const tareasGuardado = await tareas.save();

    res.json(tareasGuardado);
  } catch (error) {
    console.log(error);
  }
};


const actualizar = async (req, res) => {
  const { nombre } = req.body;
  const { proyecto } = req.body;
  const { descripcion } = req.body;
  const { estado } = req.body;
  const {fechaEntrega } = req.body;
  const { prioridad } = req.body;
  const { _id } = req.body;

  
  // prevenir tareas duplicadas
  const tarea =  await Tareas.findOne({_id: { $eq: _id}});
  console.log(tarea)
  console.log(prioridad)
  if (!tarea) {
    const error = new Error("La tarea no existe");
    return res.status(400).json({ msg: error.message });
  }
  const existeTarea =  await Tareas.findOne({proyecto: { $eq: proyecto} ,nombre: { $eq: nombre}});

  if (existeTarea) {
    const error = new Error("La tarea ya existe");
    return res.status(400).json({ msg: error.message });
  }

  try {
    // GUardar tareas
    tarea.nombre = nombre
  } catch (error) {
    console.log(error);
  }
  try {
    // GUardar tareas
  
    tarea.descripcion = descripcion
  } catch (error) {
    console.log(error);
  }
  try {
    tarea.estado = estado
  } catch (error) {
    console.log(error);
  }
  try {

    tarea.fechaEntrega = fechaEntrega
  } catch (error) {
    console.log(error);
  }
  try {

    tarea.prioridad = prioridad
     } catch (error) {
    console.log(error);
  }
  try {
    tarea.proyecto = proyecto
  } catch (error) {
    console.log(error);
  }
  try {

    await tarea.save();
    res.json({ msg: "Actualiado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const eliminar = async (req, res) => {
  const { _id,user_id } = req.body;

  // prevenir tareas duplicadas
  const existeTarea =  await Tareas.findOne({_id: { $eq: _id} ,user_id: { $eq: user_id}});

  if (!existeTarea) {
    const error = new Error("No tiene permisos para eliminar o la tarea ya no existe");
    return res.status(400).json({ msg: error.message });
  }

  try {
    // Eliminar tareas
    await Tareas.deleteOne({_id: { $eq : _id}})

    res.json({ msg: "Eliminado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const dataTareas = async (req, res) => {
  const {proyecto } = req.body;

  // prevenir tareas duplicadas
  const tareas =  await Tareas.findOne({proyecto: { $eq: proyecto}});

  if (!tareas) {
    const error = new Error("El proyecto no existe");
    return res.status(400).json({ msg: error.message });
  }
  const listadoTareas =  await Tareas.find({proyecto: { $eq: proyecto}});
  if (!listadoTareas) {
    const error = new Error("No hay tareas");
    return res.status(400).json({ msg: error.message });
  }
  try {
    res.json(listadoTareas);
  } catch (error) {
    console.log(error);
  }
 
};

export {
  registrar,
  actualizar,
  eliminar,
  dataTareas,
};
