import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import emailRegistro from "../helpers/emailRegisto.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
  const { email, nombre } = req.body;

  // prevenir usuarios duplicados
  const existeUsuario = await Usuario.findOne({ email });

  if (existeUsuario) {
    const error = new Error("Usuario ya registrado - DESDE BACKEND");
    return res.status(400).json({ msg: error.message });
  }

  try {
    // GUardar un NUevo Usuario
    const usuario = new Usuario(req.body);
    const usuarioGuardado = await usuario.save();

    // enviar email al usuario para ser confirmado
    emailRegistro({
      email,
      nombre,
      token: usuarioGuardado.token,
    });

    res.json(usuarioGuardado);
  } catch (error) {
    console.log(error);
  }
};

const usuarioAll = async (req, res) => {
  const usuarioALL = await Usuario.find();
  console.log(usuarioAll)
  res.json(usuarioALL)
}

const perfil = (req, res) => {
  const { usuario } = req;
  res.json(usuario);
};

const confirmar = async (req, res) => {
  const { token } = req.params;

  const usuarioConfirmar = await Usuario.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error("Token no valido");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();
    res.json({ msg: "Usuario confirmado Correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  //comprobando si el usuario existe
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  // comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("TU cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  // Revisar al password
  if (await usuario.comprobarPassword(password)) {
    // autenticar

    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
    console.log("password correcto");
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const existeUsuario = await Usuario.findOne({ email });
  if (!existeUsuario) {
    const error = new Error("El Usuario no existe");
    return res.status(400).json({ msg: error.message });
  }

  try {
    existeUsuario.token = generarId();
    await existeUsuario.save();

    //Creacion del correo
    emailOlvidePassword({
      email,
      nombre: existeUsuario.nombre,
      token: existeUsuario.token,
    });

    // Enviar Email con instrucciones
    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Usuario.findOne({ token });

  if (tokenValido) {
    // El TOken es válido el usuario si existe
    res.json({ msg: "Token válido y el usuario si existe" });
  } else {
    const error = new Error("Token no válido");
    return res.status(400).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });
  if (!usuario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  try {
    usuario.token = null;
    usuario.password = password;
    await usuario.save();
    res.json({ msg: "Password modificado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const actualizarPerfil = async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);

  if (!usuario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  const { email } = req.body;
  if (usuario.email !== req.body.email) {
    const existeEmail = await Usuario.findOne({ email });

    if (existeEmail) {
      const error = new Error("Ese email ya esta en uso");
      return res.status(400).json({ msg: error.message });
    }
  }

  try {
    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    usuario.web = req.body.web;
    usuario.telefono = req.body.telefono;

    const usuarioActualizado = await usuario.save();
    res.json(usuarioActualizado);
  } catch (error) {
    console.log(error);
  }
};

const actualizarPassword = async (req, res) => {
  // Leer los datos
  const { id } = req.usuario;
  const { pwd_actual, pwd_nuevo } = req.body;

  //Comprobar que el Usuario existe
  const usuario = await Usuario.findById(id);
  if (!usuario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  if (await usuario.comprobarPassword(pwd_actual)) {
    // Almacenar el nuevo password

    usuario.password = pwd_nuevo;
    await usuario.save();
    res.json({ msg: "Contraseña Almacenado Correctamente" });
  } else {
    const error = new Error("La Contraseña Actual es Incorrecto");
    return res.status(400).json({ msg: error.message });
  }
};

export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword,
  usuarioAll,
};
