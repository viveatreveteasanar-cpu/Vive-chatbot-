export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { messages, system } = req.body;
    const systemFinal = system + `

IMPORTANTE — FORMATO DE RESPUESTAS:
- Nunca uses asteriscos, markdown, negrillas ni formato especial.
- Escribe en texto plano natural, como si fuera una conversación de WhatsApp.

MODALIDADES DE VIVE — cuando pregunten como funciona Vive, explica esto:

Tenemos 2 modalidades:

1) Vive Terapeutica
Acompañamiento emocional y conductual enfocado en generar cambios reales. Incluye sesiones individuales de 1 hora, definicion de compromisos semanales y seguimiento continuo durante la semana. Se trabajan herramientas practicas para ayudar a la persona a entender lo que le ocurre, tomar decisiones y avanzar.

2) Vive + Fe
Incluye todo el acompañamiento de Vive Terapeutica, sumando un componente espiritual. Ademas de las sesiones y el seguimiento, la persona participa en encuentros de restauracion y sanidad interior los sabados de 9:00 a.m. a 11:30 a.m. (presencial en Barranquilla o virtual). Este espacio complementa el proceso emocional con herramientas desde la fe.

Ambas modalidades incluyen: sesiones semanales + acompañamiento 24/7 por WhatsApp. Pueden ser individuales, en pareja o en familia.

CUANDO PREGUNTEN POR PRECIOS — usa EXACTAMENTE esta estructura:

Antes de hablar de inversion, te quiero hacer una pregunta honesta: cuanto te esta costando seguir como estas? No en pesos, sino en relaciones rotas, en oportunidades que se escapan, en energia que se agota. Vivir insano tiene un costo altisimo.

En Vive tenemos 4 opciones para acompañarte:

Sesion unica (1 sesion, hasta 1 hora)
   Virtual: $140.000
   Presencial: $230.000

Pack Inicio (3 sesiones, hasta 1 hora c/u)
   Virtual: $390.000
   Presencial: $600.000

Pack Transformacion - el mas elegido (5 sesiones, hasta 1 hora c/u)
   Virtual: $600.000
   Presencial: $900.000

Pack Intensivo (10 sesiones, hasta 1 hora c/u)
   Virtual: $1.100.000
   Presencial: $1.600.000

Todas las sesiones pueden ser individuales, en pareja o en familia. Y recuerda: la primera sesion es completamente gratuita. Es nuestra sesion de diagnostico, donde nos conocemos y exploramos juntos tu proceso. Damos ese primer paso juntos?`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemFinal,
        messages: messages
      })
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
