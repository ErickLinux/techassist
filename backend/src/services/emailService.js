import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export const enviarCodigoRecuperacion = async ({
  correo,
  nombre,
  codigo
}) => {

  const { data, error } = await resend.emails.send({
    from: "TechAssist <onboarding@resend.dev>",
    to: [correo],
    subject:
      "Recuperación de contraseña - TechAssist",

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 30px;
          background: #f5f7fb;
        "
      >

        <div
          style="
            background: white;
            padding: 30px;
            border-radius: 12px;
          "
        >

          <h2
            style="
              margin-top: 0;
              color: #212529;
            "
          >
            TechAssist
          </h2>

          <h3>
            Recuperación de contraseña
          </h3>

          <p>
            Hola ${nombre},
          </p>

          <p>
            Recibimos una solicitud para
            restablecer tu contraseña de
            TechAssist.
          </p>

          <p>
            Tu código de recuperación es:
          </p>

          <div
            style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              text-align: center;
              padding: 20px;
              margin: 20px 0;
              background: #f1f3f5;
              border-radius: 8px;
            "
          >
            ${codigo}
          </div>

          <p>
            Este código tiene una validez
            de <strong>10 minutos</strong>.
          </p>

          <p>
            Si no solicitaste este cambio,
            puedes ignorar este correo.
          </p>

          <hr
            style="
              border: 0;
              border-top: 1px solid #ddd;
              margin: 25px 0;
            "
          >

          <small style="color: #6c757d;">
            TechAssist
          </small>

        </div>

      </div>
    `
  });

  if (error) {
    console.error(
      "Error enviando correo con Resend:",
      error
    );

    throw new Error(
      "No fue posible enviar el correo de recuperación"
    );
  }

  console.log(
    "Correo de recuperación enviado:",
    data?.id
  );

  return data;
};