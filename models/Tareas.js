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
    },
    estado: {
      type: Boolean,
      default: false,
    },
    fechaEntrega: {
      type: Date,
      default: Date.now(),
    },
    prioridad: {
      type: String,
      //required: true,
      enum: ["Baja", "Media", "Alta"],
    },
    proyecto: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Proyecto",
     //type: Number,
     required:true,
    },
    creador_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Usuario",
    },
    responsables:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
      }
    ],


  },
  {
    timestamps: true,
  }
);

const Tareas = mongoose.model("Tareas", tareaSchema);
export default Tareas;