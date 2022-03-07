import Proyecto from "../models/Proyecto.js";
import Usuario from "../models/Usuario.js";

const crearProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario._id;
  console.log(req.usuario);
  await proyecto
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
};

//obtener un proyecto por ID
const obtenerProyecto = async (req, res) => {
  const { id } = req.params;
  
  const proyecto = await Proyecto.findById(id);

  if (!proyecto){
    const error = new Error("No Encontrado");
    return res.status(404).json({msg: error.message});
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Sin permiso de acceder");
    return res.status(403).json({msg: error.message});
  }
  res.json(proyecto)
};

//eliminar
const obtenerProyectoPorCreador = async (req, res) => {
  const { creadorId } = req.params;
  await Proyecto.find({ creador: creadorId })
    .then((data) => {
      if (!data.length)
        return res.status(404).send("Este usuario no tiene proyectos");
      res.json(data);
    })
    .catch((error) => res.status(400).json({ message: error }));
};

//para obtener los proyectos de un usuario
const obtenerTodosLosProyectos = async (req, res) => {
  await Proyecto.find().where('creador').equals(req.usuario)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
};

const actualizarProyecto = async (req, res) => {
  const { id } = req.params;

  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("Proyecto No Encontrado");
    return res.status(404).json({msg: error.message});
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Sin permiso de Modificar el proyecto");
    return res.status(403).json({msg: error.message});
  }

  proyecto.nombre = req.body.nombre || proyecto.nombre;
  proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
  proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
  proyecto.cliente = req.body.cliente || proyecto.cliente;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado)
  } catch (error) {
    return res.status(503).json({msg: error.message})
  }

};

const eliminarProyecto = async (req, res) => {
  const { id } = req.params;
  
  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("Proyecto No Encontrado");
    return res.status(404).json({msg: error.message});
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Sin permiso de eliminar el proyecto");
    return res.status(403).json({msg: error.message});
  }

  try {
    await proyecto.deleteOne();
    res.json({msg: "Proyecto Eliminado"})
  } catch (error) {
    return res.status(503).json({msg: error.message})
  }
};

export {
  crearProyecto,
  obtenerProyecto,
  obtenerProyectoPorCreador,
  obtenerTodosLosProyectos,
  actualizarProyecto,
  eliminarProyecto,
};