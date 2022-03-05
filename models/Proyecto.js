import mongoose from "mongoose";

const proyectosSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    descripcion: {
      type: String,
      required: true,
      trim: true
    },
    fechaEntrega: {
      type: Date,
      default: Date.now()
    },
    cliente: {
      type: String,
      required: true,
      trim: true
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario"
    },
    colaboradores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
      }
    ],
    tares: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tarea"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Proyectos', proyectosSchema);