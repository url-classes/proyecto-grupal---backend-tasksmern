import Chat from "../models/Chat.js";
import Usuario from "../models/Usuario.js";

const crearChat = async (req, res) => {
  // id del usuario con el que se desea crear el chat
  const { usuarioId } = req.body;

  // Si no se envia el id del usuario
  if (!usuarioId) {
    console.log("No se ha enviado el id del usuario en la peticion");
    return res.sendStatus(400);
  }

  // Chequear si existe el chat con este usuario
  var isChat = await Chat.find({
    esChatGrupal: false,
    $and: [
      { usuarios: { $elemMatch: { $eq: req.usuario._id } } },
      { usuarios: { $elemMatch: { $eq: usuarioId } } },
    ],
  })
    .populate("usuarios", "-password")
    .populate("ultimoMensaje");

  isChat = await Usuario.populate(isChat, {
    path: "ultimoMensaje.emisor",
    select: "nombre email telefono",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);

    //Si no existe se crea
  } else {
    var chatData = {
      nombreChat: "emisor",
      esChatGrupal: false,
      usuarios: [req.usuario._id, usuarioId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "usuarios",
        "-password"
      );

      res.status(200).send(FullChat);
    } catch (error) {
      return res.status(503).json({ msg: error.message });
    }
  }
};

const chatsUsuario = async (req, res) => {
  try {
    // Buscar todos los chats de los que es parte el usuario logeado
    Chat.find({
      usuarios: { $elemMatch: { $eq: req.usuario._id } },
    })
      .populate("usuarios", "-password")
      .populate("adminGrupo", "-password")
      .populate("ultimoMensaje")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await Usuario.populate(results, {
          path: "ultimoMensaje.emisor",
          select: "nombre email telefono",
        });

        res.status(200).send(results);
      });
  } catch (error) {
    return res.status(503).json({ msg: error.message });
  }
};

const crearChatGrupal = async (req, res) => {
  if (!req.body.usuarios || !req.body.nombreChat) {
    return res
      .status(400)
      .send({ message: "Por favor llene todos los campos" });
  }

  var usuarios = JSON.parse(req.body.usuarios);
  // Se puede usar JSON.stringify para el post en front

  if (usuarios.length < 2) {
    return res
      .status(400)
      .send("Se necesitan mas de dos usuarios para crear un chat grupal");
  }

  usuarios.push(req.usuario);

  try {
    const chatGrupal = await Chat.create({
      nombreChat: req.body.nombreChat,
      usuarios: usuarios,
      esChatGrupal: true,
      adminGrupo: req.usuario,
    });

    const fullChatGrupal = await Chat.findOne({ _id: chatGrupal._id })
      .populate("usuarios", "-password")
      .populate("adminGrupo", "-password");

    res.status(200).json(fullChatGrupal);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

const renombrarChat = async (req, res) => {
  const { chatId, nombreChat } = req.body;

  const chatActualizado = await Chat.findByIdAndUpdate(
    chatId,
    {
      nombreChat: nombreChat,
    },
    {
      new: true,
    }
  )
    .populate("usuarios", "-password")
    .populate("adminGrupo", "-password");

  if (!chatActualizado) {
    const error = new Error("Sin permiso de acceder");
    return res.status(404).json({ msg: error.message });
  } else {
    res.json(chatActualizado);
  }
};

const agregarUserGrupo = async (req, res) => {
  const { chatId, usuarioId } = req.body;

  const agregado = await Chat.findByIdAndUpdate(
    chatId,
    {
      $addToSet: { usuarios: usuarioId },
    },
    {
      new: true,
    }
  )
    .populate("usuarios", "-password")
    .populate("adminGrupo", "-password");

  if (!agregado) {
    const error = new Error("Chat no encontrado");
    return res.status(404).json({ msg: error.message });
  } else {
    res.json(agregado);
  }
};

const eliminarUserGrupo = async (req, res) => {
  const { chatId, usuarioId } = req.body;

  // check if the requester is admin

  const eliminado = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { usuarios: usuarioId },
    },
    {
      new: true,
    }
  )
    .populate("usuarios", "-password")
    .populate("adminGrupo", "-password");

  if (!eliminado) {
    const error = new Error("Chat no encontrado");
    return res.status(404).json({ msg: error.message });
  } else {
    res.json(eliminado);
  }
};

export {
  crearChat,
  chatsUsuario,
  crearChatGrupal,
  renombrarChat,
  agregarUserGrupo,
  eliminarUserGrupo,
};
