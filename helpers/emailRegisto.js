import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre, token } = datos;

  // Enviar el email al usuario

  const info = await transporter.sendMail({
    from: "TasksMern - Administrador de Tareas",
    to: email,
    subject: "Comprueba tu cuenta en TaksMern",
    text: "Comprueba tu cuenta en TaksMern",
    html: `<p>Hola: ${nombre}, comprueba tu cuenta en TaksMern.</p>
        <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a> </p>

        <p> si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
      `,
  });

  console.log("Mensaje enviado: %s", info.messageId);
};

export default emailRegistro;
