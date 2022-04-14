const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    nombreChat: {
      type: String,
      trim: true,
    },
    esChatGrupal: {
      type: Boolean,
      default: false,
    },
    usuarios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    ultimoMensaje: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    adminGrupo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
