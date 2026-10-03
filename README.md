# bio.mvms.dev

Página de links do Marcos Vinicius: foto, bio, relógio e clima de Goiás, link para o [mvms.dev](https://www.mvms.dev), a música que está tocando no Spotify e as redes sociais. Feita com Next.js (App Router), TypeScript e Tailwind CSS v4, publicada na Vercel e instalável como app (PWA).

## Rodando localmente

```bash
npm install
npm run dev        # http://localhost:3000
```

Outros comandos:

| Comando | O que faz |
| --- | --- |
| `npm run lint` | ESLint |
| `npm run typecheck` | Checagem de tipos do TypeScript |
| `npm test` | Testes (Vitest) |
| `npm run build` | Build de produção |
| `npm run icons` | Gera de novo os ícones do app em `public/icons/` |

O CI roda lint, typecheck, testes e build em todo PR.

## Onde mudar cada coisa

- **Nome, bio, link principal e redes sociais:** `lib/constants.ts`.
- **Datas especiais no relógio (Natal, Ano Novo…):** `EVENTOS_ESPECIAIS` em `lib/events.ts`.
- **Música padrão do card do Spotify:** `lib/spotify-default.ts` (aparece quando o backend da música está fora do ar).
- **Cores e fontes:** tokens em `app/globals.css` (tema claro e escuro), a mesma paleta do mvms.dev.

## Variáveis de ambiente

| Variável | Para quê |
| --- | --- |
| `LASTFM_API_KEY` | Chave da API do Last.fm ([criar](https://www.last.fm/api/account/create)). Com ela a música vem direto do Last.fm, por HTTPS, em ~200 ms. |

Localmente, copie `.env.example` para `.env.local`.

## De onde vêm os dados

- **Clima:** `/api/clima` busca no [wttr.in](https://wttr.in) a cada 10 minutos. Se ele não responder, a linha mostra só "Goiás, Brasil".
- **Música:** `/api/musguinha` consulta o [Last.fm](https://www.last.fm/api) a cada 10 segundos e mostra o que está tocando (ou a última tocada, com "há 5 minutos"). Se ele não responder, o card mostra a música padrão. Precisa da variável `LASTFM_API_KEY` na Vercel (veja `.env.example`); sem ela, a página cai no backend antigo ([link-in-bio-api](https://github.com/manteguinha/link-in-bio-api)).

O service worker (`public/sw.js`) guarda a página e os arquivos estáticos para abrir offline, mas nunca as respostas da API, para o clima e a música não aparecerem atrasados.
