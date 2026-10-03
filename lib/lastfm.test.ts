import { describe, expect, it } from "vitest"
import {
  escolherImagem,
  faixaDoLastfm,
  imagemSegura,
  linkSeguro,
  unixParaIso,
  urlRecentTracks,
  type LastfmRecentTracks,
  type LastfmTrack,
} from "./lastfm"
import { DEFAULT_TRACK } from "./spotify-default"

const CAPA = "https://lastfm.freetls.fastly.net/i/u/300x300/abc.jpg"

function resposta({ tocando = false, imagens = true }: { tocando?: boolean; imagens?: boolean } = {}): LastfmRecentTracks {
  return {
    recenttracks: {
      track: [
        {
          name: "Back in Black",
          artist: { "#text": "AC/DC" },
          album: { "#text": "Back in Black" },
          url: "https://www.last.fm/music/AC%2FDC/_/Back+in+Black",
          image: imagens
            ? [
                { size: "small", "#text": "https://lastfm.freetls.fastly.net/i/u/34s/abc.jpg" },
                { size: "extralarge", "#text": CAPA },
              ]
            : [{ size: "large", "#text": "" }],
          ...(tocando ? { "@attr": { nowplaying: "true" } } : { date: { uts: "1700000000" } }),
        },
      ],
    },
  }
}

describe("urlRecentTracks", () => {
  it("pede só a faixa mais recente, em JSON, com a chave", () => {
    const url = new URL(urlRecentTracks("manteguinhaa", "chave"))
    expect(url.origin + url.pathname).toBe("https://ws.audioscrobbler.com/2.0/")
    expect(Object.fromEntries(url.searchParams)).toEqual({
      method: "user.getrecenttracks",
      user: "manteguinhaa",
      api_key: "chave",
      format: "json",
      limit: "1",
    })
  })
})

describe("linkSeguro e imagemSegura", () => {
  it("aceitam só HTTPS nos domínios do Last.fm", () => {
    expect(linkSeguro("https://www.last.fm/music/AC%2FDC")).toBe("https://www.last.fm/music/AC%2FDC")
    expect(imagemSegura(CAPA)).toBe(CAPA)
  })

  it("trocam pelo fallback qualquer coisa estranha (outro host, http, javascript:, vazio)", () => {
    for (const ruim of ["https://evil.example/x", "http://www.last.fm/x", "javascript:alert(1)", "", null, 42]) {
      expect(linkSeguro(ruim)).toBe(DEFAULT_TRACK.link)
      expect(imagemSegura(ruim)).toBe(DEFAULT_TRACK.imagem)
    }
  })

  it("troca a capa genérica do Last.fm (estrela cinza) pela imagem do fallback", () => {
    expect(imagemSegura("https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png")).toBe(
      DEFAULT_TRACK.imagem
    )
  })
})

describe("escolherImagem", () => {
  it("prefere a maior", () => {
    const [faixa] = resposta().recenttracks!.track as LastfmTrack[]
    expect(escolherImagem(faixa.image)).toBe(CAPA)
  })

  it("devolve null sem imagens úteis", () => {
    expect(escolherImagem([{ size: "large", "#text": "  " }])).toBeNull()
    expect(escolherImagem(undefined)).toBeNull()
  })
})

describe("unixParaIso", () => {
  it("converte segundos Unix em ISO", () => {
    expect(unixParaIso("1700000000")).toBe("2023-11-14T22:13:20.000Z")
    expect(unixParaIso(1700000000)).toBe("2023-11-14T22:13:20.000Z")
  })

  it("devolve null para valores inválidos", () => {
    for (const ruim of [undefined, null, "", "abc", "0", false]) expect(unixParaIso(ruim)).toBeNull()
  })
})

describe("faixaDoLastfm", () => {
  it("monta o payload da página com a última música e quando ela tocou", () => {
    expect(faixaDoLastfm(resposta())).toEqual({
      isPlaying: false,
      nome: "Back in Black",
      artista: "AC/DC",
      imagem: CAPA,
      link: "https://www.last.fm/music/AC%2FDC/_/Back+in+Black",
      tocadaEm: "2023-11-14T22:13:20.000Z",
    })
  })

  it("marca que está tocando (nowplaying vem como string) e sem data", () => {
    const faixa = faixaDoLastfm(resposta({ tocando: true }))
    expect(faixa?.isPlaying).toBe(true)
    expect(faixa?.tocadaEm).toBeNull()
  })

  it("usa a capa do fallback quando o álbum não tem imagem", () => {
    expect(faixaDoLastfm(resposta({ imagens: false }))?.imagem).toBe(DEFAULT_TRACK.imagem)
  })

  it("devolve null quando o usuário não ouviu nada", () => {
    expect(faixaDoLastfm({ recenttracks: { track: [] } })).toBeNull()
    expect(faixaDoLastfm({})).toBeNull()
  })
})
