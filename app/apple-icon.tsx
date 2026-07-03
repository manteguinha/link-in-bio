import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "#292a2d",
          color: "#b538d7",
          fontSize: 110,
          fontWeight: 700,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        M
      </div>
    ),
    { ...size }
  )
}
