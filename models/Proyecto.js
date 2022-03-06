import mongoose from "mongoose";

const proyectoSchema = mongoose.Schema(
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
      required: true,
      ref: "Usuario"
    },
    colaboradores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
      }
    ],
    tareas: [
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

const Proyecto = mongoose.model("Proyecto", proyectoSchema);
export default Proyecto;