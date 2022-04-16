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
  
  const proyecto = await Proyecto.findById(id).populate({
    path: "tareas",
    populate: { path: "completado", select: "nombre" },
  }).
  populate("colaboradores", "nombre email");

  if (!proyecto){
    const error = new Error("No Encontrado");
    return res.status(404).json({msg: error.message});
  }

  if (
    proyecto.creador.toString() !== req.usuario._id.toString() &&
    !proyecto.colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )
  ) {
    const error = new Error("Sin permiso de acceder");
    return res.status(403).json({msg: error.message});
  }
  res.json(proyecto)
};

//para obtener los proyectos de un usuario
const obtenerTodosLosProyectos = async (req, res) => {
  await Proyecto.find({
    $or: [
      { colaboradores: { $in: req.usuario } },
      { creador: { $in: req.usuario } },
    ],
  }).select('-tareas')
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
const buscarColaborador = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email }).select(
    "-confirmado -createdAt -password -token -updatedAt -__v "
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  res.json(usuario);
};

const agregarColaborador = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);

  if (!proyecto) {
    const error = new Error("Proyecto No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(404).json({ msg: error.message });
  }

  const { email } = req.body;
  const usuario = await Usuario.findOne({ email }).select(
    "-confirmado -createdAt -password -token -updatedAt -__v "
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  // El colaborador no es el admin del proyecto
  if (proyecto.creador.toString() === usuario._id.toString()) {
    const error = new Error("El Creador del Proyecto no puede ser colaborador");
    return res.status(404).json({ msg: error.message });
  }

  // Revisar que no este ya agregado al proyecto
  if (proyecto.colaboradores.includes(usuario._id)) {
    const error = new Error("El Usuario ya pertenece al Proyecto");
    return res.status(404).json({ msg: error.message });
  }

  // Esta bien, se puede agregar
  proyecto.colaboradores.push(usuario._id);
  await proyecto.save();
  res.json({ msg: "Colaborador Agregado Correctamente" });
};



const eliminarColaborador = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);

  if (!proyecto) {
    const error = new Error("Proyecto No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(404).json({ msg: error.message });
  }

  // Esta bien, se puede eliminar
  proyecto.colaboradores.pull(req.body.id);
  await proyecto.save();
  res.json({ msg: "Colaborador Eliminado Correctamente" });
};

export {
  crearProyecto,
  obtenerProyecto,
  obtenerTodosLosProyectos,
  actualizarProyecto,
  eliminarProyecto,
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador,

};