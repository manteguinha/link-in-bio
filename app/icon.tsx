import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "#292a2d",
          color: "#b538d7",
          fontSize: 26,
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
