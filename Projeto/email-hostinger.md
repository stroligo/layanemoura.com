# E-mail do formulário de contacto (SMTP)

O formulário em `/get-in-touch` envia e-mail pelo servidor (`POST /api/contact`).  
Se faltar SMTP, a UI mostra: *"The contact form is not configured on the server yet"* (HTTP **503**).

## 1. Criar a caixa de correio (se ainda não existir)

1. [hPanel Hostinger](https://hpanel.hostinger.com) → **E-mails** → **Contas de e-mail**
2. Criar ou confirmar: `hi@layanemoura.com`
3. Definir uma **senha forte** (é a `SMTP_PASS`)

## 2. Dados SMTP (Hostinger)

| Variável | Valor |
| --- | --- |
| `SMTP_HOST` | `smtp.hostinger.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` (TLS na porta 587) |
| `SMTP_USER` | `hi@layanemoura.com` |
| `SMTP_PASS` | senha da caixa de e-mail |
| `CONTACT_TO_EMAIL` | para onde chegam as mensagens (`hi@layanemoura.com`) |
| `CONTACT_FROM_EMAIL` | mesmo e-mail autenticado (`hi@layanemoura.com`) |

Alternativa SSL: `SMTP_PORT=465` e `SMTP_SECURE=true`.

## 3. Desenvolvimento local

Na raiz do projeto:

```bash
cp .env.example .env   # se ainda não tiver
```

Edite `.env` e preencha **`SMTP_PASS`**.

Reinicie o servidor:

```bash
npm run dev
```

Teste o envio:

```bash
npm run contact:test-smtp
```

## 4. Produção (Hostinger Node)

No painel da app Node / variáveis de ambiente, defina **as mesmas chaves** (não commite `.env`):

- `NUXT_PUBLIC_SITE_URL=https://layanemoura.com`
- `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `CONTACT_FROM_NAME`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`

Depois de alterar variáveis em produção, **reinicie** a aplicação Node.

## 5. Problemas comuns

| Sintoma | Causa provável |
| --- | --- |
| 503 *not configured* | `SMTP_HOST`, `SMTP_USER` ou `SMTP_PASS` vazios no servidor |
| 500 *Failed to send* | Senha errada, porta errada, ou SMTP bloqueado no plano |
| E-mail na spam | Normal no início; marcar como “não é spam” |

Logs no servidor: mensagem `[contact] Failed to send email`.
