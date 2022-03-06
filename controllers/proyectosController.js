import Proyecto from "../models/Proyecto.js";
import Usuario from "../models/Usuario.js";

const crearProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.Usuario._id;
  await proyecto
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
};

const obtenerProyecto = async (req, res) => {
  const { id } = req.params;
  await Proyecto.findById(id)
    .then((data) => {
      if (!data) return res.status(404).send("Proyecto no encontrado");
      res.json(data);
    })
    .catch((error) => res.status(404).json({ message: error }));
};

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

const obtenerTodosLosProyectos = async (req, res) => {
  await Proyecto.find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
};

const actualizarProyecto = async (req, res) => {
  const { id } = req.params;
  let camposActualizar = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    fechaEntrega: req.body.fechaEntrega,
    cliente: req.body.cliente,
    creador: req.body.creador,
    colaboradores: req.body.colaboradores,
    tareas: req.body.tareas,
  };
  // Eliminar los campos no definidos en el body
  for (const [key, value] of Object.entries(camposActualizar)) {
    if (!value) {
      delete camposActualizar[key];
    }
  }
  await Proyecto.findOneAndUpdate(
    { _id: id },
    { $set: { ...camposActualizar } },
    { runValidators: true, new: true }
  )
    .then((data) => {
      if (!data) return res.status(404).send("Proyecto no encontrado");
      res.json(data);
    })
    .catch((error) => res.status(400).json({ message: error }));
};

const eliminarProyecto = async (req, res) => {
  const { id } = req.params;
  await Proyecto.deleteOne({ _id: id })
    .then((data) => {
      if (data.deletedCount<1) return res.status(404).send("Proyecto no encontrado");
      res.json(data);
    })
    .catch((error) => res.json({ message: error }));
};

export {
  crearProyecto,
  obtenerProyecto,
  obtenerProyectoPorCreador,
  obtenerTodosLosProyectos,
  actualizarProyecto,
  eliminarProyecto,
};
