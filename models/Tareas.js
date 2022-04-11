import mongoose from "mongoose";
const tareaSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
    },
    descripcion: {
      type: String,
      trim: true,
      require: true,
    },
    estado: {
      type: Boolean,
      default: false,
    },
    fechaEntrega: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    prioridad: {
      type: String,
      required: true,
      enum: ["Baja", "Media", "Alta"],
    },
    proyecto: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Proyecto",
    },
    creador_id: {
      type: mongoose.Schema.Types.ObjectId,
     // required: true,
      ref: "Usuario",
    },
    completado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Tareas = mongoose.model("Tareas", tareaSchema);
export default Tareas;