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
 //     required: true,
    },
    estado: {
      type: Boolean,
      default: false,
    },
    fechaEntrega: {
      type: Date,
    //  required: true,
      default: Date.now(),
    },
    prioridad: {
      type: String,
    //  required: true,
      enum: ["Baja", "Media", "Alta"],
    },
    proyecto: {
     // type: mongoose.Schema.Types.ObjectId,
     // ref: "Proyecto",
     type: Number,
     required:true,
    },
    user_id: {
      //type: mongoose.Schema.Types.ObjectId,
      //ref: "Usuario",
      //default: null,
      type: Number,
     required:true,
    },
    responsables:{
      //type: mongoose.Schema.Types.ObjectId,
      //ref: "Usuario",
      //default: null,
      type: Array,
     required:true,
    },


  },
  {
    timestamps: true,
  }
);

const Tarea = mongoose.model("Tarea", tareaSchema);
export default Tarea;