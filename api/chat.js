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

CUANDO PREGUNTEN POR PRECIOS — usa EXACTAMENTE esta estructura:

Antes de hablar de inversión, te quiero hacer una pregunta honesta: ¿cuánto te está costando seguir como estás? No en pesos, sino en relaciones rotas, en oportunidades que se escapan, en energía que se agota. Vivir insano tiene un costo altísimo.

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

Todas las sesiones pueden ser individuales, en pareja o en familia. Y recuerda: la primera sesion es completamente gratuita. Es nuestra sesion de diagnostico, donde nos conocemos y exploramos juntos tu proceso. No hay nada que perder, pero si mucho que ganar. Damos ese primer paso juntos?`;

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
