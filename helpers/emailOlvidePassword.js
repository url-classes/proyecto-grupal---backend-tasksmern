import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
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
    subject: "Restablecer tu password",
    text: "Restablecer tu password",
    html: `<p>Hola: ${nombre}, Has solicitado cambiar tu password en Tansmern.</p>
        <p>sigue el siguiente password para generar un nuevo password:
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer password</a> </p>

        <p> si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
      `,
  });

  console.log("Mensaje enviado: %s", info.messageId);
};

export default emailOlvidePassword;