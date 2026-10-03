import { ImageResponse } from "next/og"
import { PROFILE, SITE } from "@/lib/constants"

export const alt = SITE.title
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Foto do GitHub embutida na imagem (gerada no build). Se não der para baixar, sai sem ela.
async function carregarAvatar(): Promise<string | null> {
  try {
    const res = await fetch(PROFILE.avatarUrl, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) throw new Error(`status ${res.status}`)
    const tipo = res.headers.get("content-type") ?? "image/png"
    return `data:${tipo};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`
  } catch (error) {
    console.warn("Imagem de compartilhamento sem a foto do GitHub:", error)
    return null
  }
}

export default async function OpengraphImage() {
  const foto = await carregarAvatar()
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          width: "100%",
          background: "#292a2d",
          padding: 80,
        }}
      >
        {foto ? (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img
            src={foto}
            width={224}
            height={224}
            style={{ borderRadius: 112, marginRight: 64, border: "6px solid #b538d7" }}
          />
        ) : null}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: "#ffffff" }}>{SITE.author}</div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 34,
              fontFamily: "monospace",
              color: "#a9a9b3",
            }}
          >
            {SITE.description}
          </div>
          <div style={{ display: "flex", marginTop: 40, fontSize: 28, color: "#a9a9b3" }}>
            {new URL(SITE.url).hostname}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 40,
              height: 8,
              width: 220,
              background: "#b538d7",
              borderRadius: 4,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  )
}
