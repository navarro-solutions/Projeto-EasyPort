# Easy Port

Site institucional da Easy Port: posto de monitoramento 24 horas conectado ao Smart Sampa e consultoria de gestão em portaria remota (processos, capacitação de pessoas e organização dos setores).

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

## Pontos para ajustar antes do lançamento

- Confirmar o nome da marca: a logo diz "Easy Porter" e o título da página diz "Easy Port".
- O formulário de contato só monta o texto do pedido para copiar. Ligue a um e-mail ou WhatsApp da empresa para receber os contatos.
- Revisar os textos sobre o Smart Sampa e o fluxo de monitoramento com o que a empresa realmente entrega.
