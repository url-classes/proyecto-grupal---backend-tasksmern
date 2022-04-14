import mongoose from "mongoose";

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
        ref: "Usuario",
      },
    ],
    ultimoMensaje: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mensaje",
    },
    adminGrupo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
