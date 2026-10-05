// Recebe o formulário de contato do site e envia por e-mail usando o Resend.
//
// Variáveis de ambiente (configuradas no projeto da Vercel):
//   RESEND_API_KEY      chave da API do Resend (obrigatória)
//   CONTACT_TO_EMAIL    e-mail que recebe os contatos (obrigatória)
//   CONTACT_FROM_EMAIL  remetente; padrão "Site Easy Porter <onboarding@resend.dev>".
//                       Troque por um endereço do domínio da empresa depois de
//                       verificar o domínio no Resend.

const LIMITES = { nome: 120, local: 160, email: 160, telefone: 40, interesse: 120, mensagem: 4000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function limpar(valor, max) {
  return String(valor == null ? "" : valor).replace(/\r/g, "").trim().slice(0, max);
}

function escapar(texto) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function lerCorpo(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch (e) { return {}; }
  }
  return {};
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ erro: "Método não permitido." });
  }

  const corpo = lerCorpo(req);

  // Campo armadilha: pessoas não veem, robôs preenchem. Finge sucesso e descarta.
  if (corpo.site) return res.status(200).json({ ok: true });

  const dados = {};
  for (const campo of Object.keys(LIMITES)) dados[campo] = limpar(corpo[campo], LIMITES[campo]);
  dados.email = dados.email.replace(/\s/g, "");

  if (dados.nome.length < 2) return res.status(400).json({ erro: "Informe seu nome." });
  if (!EMAIL_RE.test(dados.email)) return res.status(400).json({ erro: "Informe um e-mail válido." });
  if (dados.mensagem.length < 5) return res.status(400).json({ erro: "Escreva uma mensagem sobre o que você precisa." });

  const apiKey = process.env.RESEND_API_KEY;
  const para = process.env.CONTACT_TO_EMAIL;
  const de = process.env.CONTACT_FROM_EMAIL || "Site Easy Porter <onboarding@resend.dev>";
  if (!apiKey || !para) {
    console.error("Contato: RESEND_API_KEY ou CONTACT_TO_EMAIL não configurados.");
    return res.status(500).json({ erro: "O envio de mensagens ainda não está configurado. Tente novamente mais tarde." });
  }

  const linhas = [
    ["Nome", dados.nome],
    ["Condomínio ou empresa", dados.local || "não informado"],
    ["E-mail", dados.email],
    ["Telefone ou WhatsApp", dados.telefone || "não informado"],
    ["Interesse", dados.interesse || "não informado"]
  ];

  const texto =
    linhas.map(([rotulo, valor]) => `${rotulo}: ${valor}`).join("\n") +
    `\n\nMensagem:\n${dados.mensagem}\n`;

  const html =
    `<div style="font-family:Arial,sans-serif;font-size:15px;color:#16131a;line-height:1.5">` +
    `<h2 style="color:#601766;margin:0 0 16px">Novo contato pelo site</h2>` +
    `<table cellpadding="6" style="border-collapse:collapse">` +
    linhas
      .map(([rotulo, valor]) =>
        `<tr><td style="color:#575560;vertical-align:top"><strong>${escapar(rotulo)}</strong></td><td>${escapar(valor)}</td></tr>`)
      .join("") +
    `</table>` +
    `<p style="margin:20px 0 6px"><strong>Mensagem</strong></p>` +
    `<p style="white-space:pre-wrap;margin:0;padding:12px;background:#f3f3f5;border-radius:6px">${escapar(dados.mensagem)}</p>` +
    `<p style="color:#575560;font-size:13px;margin-top:20px">Responda este e-mail para falar direto com ${escapar(dados.nome)}.</p>` +
    `</div>`;

  try {
    const resposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: de,
        to: para.split(",").map((e) => e.trim()).filter(Boolean),
        reply_to: dados.email,
        subject: `Contato pelo site: ${dados.nome} (${dados.interesse || "geral"})`,
        text: texto,
        html
      })
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      console.error("Contato: Resend respondeu", resposta.status, detalhe);
      return res.status(502).json({ erro: "Não foi possível enviar agora. Tente novamente em alguns minutos." });
    }

    return res.status(200).json({ ok: true });
  } catch (erro) {
    console.error("Contato: falha ao chamar o Resend", erro);
    return res.status(502).json({ erro: "Não foi possível enviar agora. Tente novamente em alguns minutos." });
  }
};
