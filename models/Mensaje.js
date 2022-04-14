const mongoose = require("mongoose");

const mensajeSchema = mongoose.Schema(
  {
    emisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
module.exports = Mensaje;
