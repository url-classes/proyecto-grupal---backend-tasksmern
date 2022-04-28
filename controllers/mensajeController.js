import Chat from "../models/Chat.js";
import Usuario from "../models/Usuario.js";
import Mensaje from "../models/Mensaje.js";

const obtenerMensajes = async (req, res) => {
  try {
    const messages = await Mensaje.find({ chat: req.params.chatId })
      .populate("emisor", "nombre email telefono")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

const enviarMensaje = async (req, res) => {
  const { contenido, chatId } = req.body;
  if (!contenido || !chatId) {
    console.log("Los datos enviados no son validos");
    return res.sendStatus(400);
  }

  var newMessage = {
    emisor: req.usuario._id,
    contenido: contenido,
    chat: chatId,
  };

  try {
    var message = await Mensaje.create(newMessage);

    message = await message.populate("emisor", "nombre email");
    message = await message.populate("chat");
    message = await Usuario.populate(message, {
      path: "chat.usuarios",
      select: "nombre email telefono",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { ultimoMensaje: message });

    res.json(message);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

export { obtenerMensajes, enviarMensaje };
