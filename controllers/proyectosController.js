import Proyecto from "../models/Proyecto.js";

const crearProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  await proyecto
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
};

const obtenerProyecto = async (req, res) => {
  const { id } = req.params;
  await Proyecto
    .findById(id)
    .then((data) => {
    if(!data) return res.status(404).send('Proyecto no encontrado')
    res.json(data)})
    .catch((error) => res.status(404).json({ message: error }));
};

const obtenerTodosLosProyectos = async (req, res) => {
  await Proyecto
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
};

export {
  crearProyecto,
  obtenerProyecto,
  obtenerTodosLosProyectos
};