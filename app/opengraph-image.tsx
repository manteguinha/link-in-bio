import { ImageResponse } from "next/og"
import { SITE } from "@/lib/constants"

export const alt = SITE.title
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          height: "100%",
          width: "100%",
          background: "#292a2d",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: "#ffffff" }}>
          {SITE.author}
        </div>
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
        <div
          style={{
            display: "flex",
            marginTop: 56,
            height: 8,
            width: 220,
            background: "#b538d7",
            borderRadius: 4,
          }}
        />
      </div>
    ),
    { ...size }
  )
}
