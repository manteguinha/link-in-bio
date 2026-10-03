import { afterEach, describe, expect, it, vi } from "vitest"
import { GET } from "./route"
import { DEFAULT_TRACK } from "@/lib/spotify-default"

function json(corpo: unknown, status = 200) {
  return new Response(JSON.stringify(corpo), { status, headers: { "content-type": "application/json" } })
}

const faixaLastfm = {
  recenttracks: {
    track: [
      {
        name: "Thunderstruck",
        artist: { "#text": "AC/DC" },
        url: "https://www.last.fm/music/AC%2FDC/_/Thunderstruck",
        image: [{ size: "extralarge", "#text": "https://lastfm.freetls.fastly.net/i/u/300x300/t.jpg" }],
        "@attr": { nowplaying: "true" },
      },
    ],
  },
}

describe("GET /api/musguinha", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it("com LASTFM_API_KEY, consulta o Last.fm direto e devolve a faixa normalizada", async () => {
    vi.stubEnv("LASTFM_API_KEY", "chave")
    const fetchMock = vi.fn(async () => json(faixaLastfm))
    vi.stubGlobal("fetch", fetchMock)

    const corpo = await (await GET()).json()

    const [url] = fetchMock.mock.calls[0] as unknown as [string]
    expect(url).toContain("https://ws.audioscrobbler.com/2.0/")
    expect(url).toContain("api_key=chave")
    expect(corpo).toEqual({
      isPlaying: true,
      nome: "Thunderstruck",
      artista: "AC/DC",
      imagem: "https://lastfm.freetls.fastly.net/i/u/300x300/t.jpg",
      link: "https://www.last.fm/music/AC%2FDC/_/Thunderstruck",
      tocadaEm: null,
    })
  })

  it("sem LASTFM_API_KEY, usa o backend legado e valida link e imagem", async () => {
    vi.stubEnv("LASTFM_API_KEY", "")
    const fetchMock = vi.fn(async () =>
      json({
        nome: "Highway to Hell",
        artista: "AC/DC",
        imagem: "http://evil.example/capa.jpg",
        link: "https://www.last.fm/music/AC%2FDC/_/Highway+to+Hell",
        dataHora: "1700000000",
        tocandoAgora: "false",
      })
    )
    vi.stubGlobal("fetch", fetchMock)

    const corpo = await (await GET()).json()

    const [url] = fetchMock.mock.calls[0] as unknown as [string]
    expect(url).toBe("http://144.22.176.161:3987/musguinha")
    expect(corpo).toEqual({
      isPlaying: false,
      nome: "Highway to Hell",
      artista: "AC/DC",
      imagem: DEFAULT_TRACK.imagem,
      link: "https://www.last.fm/music/AC%2FDC/_/Highway+to+Hell",
      tocadaEm: "2023-11-14T22:13:20.000Z",
    })
  })

  it("devolve o fallback (status 200) quando a fonte falha, sem data", async () => {
    vi.stubEnv("LASTFM_API_KEY", "chave")
    vi.spyOn(console, "warn").mockImplementation(() => {})
    vi.stubGlobal("fetch", vi.fn(async () => json({ error: 10, message: "Invalid API key" }, 403)))

    const res = await GET()
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual(DEFAULT_TRACK)
  })

  it("devolve o fallback quando o usuário não ouviu nada", async () => {
    vi.stubEnv("LASTFM_API_KEY", "chave")
    vi.stubGlobal("fetch", vi.fn(async () => json({ recenttracks: { track: [] } })))
    expect(await (await GET()).json()).toEqual(DEFAULT_TRACK)
  })
})
