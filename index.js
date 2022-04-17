import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import UsuarioRoutes from "./routes/usuarioRoutes.js";
import ProyectoRoutes from "./routes/proyectosRoutes.js";
import TareaRouters from "./routes/tareaRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import {fileURLToPath} from 'url';


const app = express();
app.use(express.json());
dotenv.config();

conectarDB();

// swagger setup
const __filename = fileURLToPath(import.meta.url);
const swaggerSpec = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Tasks-Mern Documentation",
      version: "1.0.0"
    },
    servers: [
      {
        url: "http://localhost:8000"
      } 
    ]
  },
  
  apis: [`${path.join(path.dirname(__filename), "./routes/*.js")}`],
};

const dominiosPermitidos = [process.env.FRONTEND_URL]
const corsOptions = {
  origin: function(origin, callback) { 
    if (dominiosPermitidos.indexOf(origin) !== -1) {
      //El origen de request esta pemitido
      callback(null, true)
    } else {
      callback(new Error('NO permitido por CORS'))
    }
  }
}


app.use(cors(corsOptions));

app.use('/api/usuarios', UsuarioRoutes);
app.use('/api/proyectos', ProyectoRoutes);
app.use('/api/tareas',TareaRouters);
// Middleware for swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJSDoc(swaggerSpec))
);

const PORT = process.env.PORT || 8000;

const servidor = app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
  });
  
// Socket.io
import { Server } from "socket.io";

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  // console.log("Conectado a socket.io");

  // Definir los eventos de socket io
  socket.on("abrir proyecto", (proyecto) => {
    socket.join(proyecto);
  });

  socket.on("nueva tarea", (tarea) => {
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit("tarea agregada", tarea);
  });

  socket.on("eliminar tarea", (tarea) => {
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit("tarea eliminada", tarea);
  });

  socket.on("actualizar tarea", (tarea) => {
    const proyecto = tarea.proyecto._id;
    socket.to(proyecto).emit("tarea actualizada", tarea);
  });

  socket.on("cambiar estado", (tarea) => {
    const proyecto = tarea.proyecto._id;
    socket.to(proyecto).emit("nuevo estado", tarea);
  });
});