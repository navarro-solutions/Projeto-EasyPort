# Easy Porter

Site institucional da Easy Porter: posto de monitoramento 24 horas conectado ao Smart Sampa e consultoria de gestão em portaria remota (processos, capacitação de pessoas e organização dos setores).

Site estático, sem etapa de build. Tudo está em `index.html`, e as imagens ficam em `assets/`.

## Ver no computador

Abra o `index.html` no navegador, ou rode um servidor local:

```bash
python3 -m http.server 8000
```

## Publicar na Vercel

1. Na Vercel, clique em **Add New > Project** e escolha este repositório.
2. Em **Framework Preset**, deixe **Other**. Não é preciso comando de build nem pasta de saída.
3. Clique em **Deploy**. Cada push na branch `main` publica uma nova versão.

## Formulário de contato

O formulário envia os dados para `api/contato.js`, uma função da Vercel que manda o e-mail pelo [Resend](https://resend.com). Configure no projeto da Vercel (Settings > Environment Variables):

| Variável | Para que serve |
| --- | --- |
| `RESEND_API_KEY` | Chave da API do Resend. |
| `CONTACT_TO_EMAIL` | E-mail que recebe os contatos. Aceita vários, separados por vírgula. |
| `CONTACT_FROM_EMAIL` | Opcional. Remetente, por exemplo `Easy Porter <contato@seudominio.com.br>`. Sem ele, o envio sai de `onboarding@resend.dev`, que só entrega para o e-mail dono da conta do Resend. |

Depois de mudar uma variável, faça um novo deploy para ela valer.

O e-mail recebido vem com "responder para" apontando para o cliente, então basta responder a mensagem. Há um campo oculto que descarta envios de robôs.

## Pontos para ajustar antes do lançamento

- Revisar os textos sobre o Smart Sampa e o fluxo de monitoramento com o que a empresa realmente entrega.
- Verificar o domínio da empresa no Resend e definir `CONTACT_FROM_EMAIL`, para os e-mails saírem com o nome da empresa e caírem menos no spam.
