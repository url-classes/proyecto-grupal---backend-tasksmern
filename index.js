import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import UsuarioRoutes from "./routes/usuarioRoutes.js";


const app = express();
app.use(express.json());
dotenv.config();

conectarDB();

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

app.use('/api/usuarios',UsuarioRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
  });
  