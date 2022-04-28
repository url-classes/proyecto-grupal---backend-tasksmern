import mongoose from "mongoose";

const mensajeSchema = mongoose.Schema(
  {
    emisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
    contenido: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

const Mensaje = mongoose.model("Mensaje", mensajeSchema);
export default Mensaje;
