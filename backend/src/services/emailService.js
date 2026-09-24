import nodemailer from "nodemailer";


// ========================================
// CONFIGURACIÓN DEL CORREO
// ========================================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  },

  tls: {
    servername: "smtp.gmail.com"
  },

  family: 4
});


// ========================================
// ENVIAR CÓDIGO DE RECUPERACIÓN
// ========================================

export const enviarCodigoRecuperacion = async ({
  correo,
  nombre,
  codigo
}) => {

  await transporter.sendMail({

    from: `"TechAssist" <${process.env.EMAIL_USER}>`,

    to: correo,

    subject:
      "Recuperación de contraseña - TechAssist",

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 25px;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
        "
      >

        <h2
          style="
            text-align: center;
            margin-bottom: 25px;
          "
        >
          TechAssist
        </h2>


        <h3>
          Recuperación de contraseña
        </h3>


        <p>
          Hola ${nombre || "usuario"},
        </p>


        <p>
          Recibimos una solicitud para
          restablecer la contraseña de tu
          cuenta de TechAssist.
        </p>


        <p>
          Tu código de verificación es:
        </p>


        <div
          style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            text-align: center;
            padding: 20px;
            margin: 25px 0;
            background: #f5f5f5;
            border-radius: 8px;
          "
        >
          ${codigo}
        </div>


        <p>
          Este código vencerá en
          <strong>10 minutos</strong>.
        </p>


        <p>
          Si no solicitaste este cambio,
          puedes ignorar este correo.
        </p>


        <hr
          style="
            margin-top: 30px;
            border: none;
            border-top: 1px solid #e5e5e5;
          "
        >


        <p
          style="
            color: #777;
            font-size: 13px;
            text-align: center;
          "
        >
          TechAssist
        </p>

      </div>
    `

  });

};