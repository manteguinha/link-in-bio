// Gera os PNGs de ícone do PWA a partir de um SVG (M roxo fundo escuro).
// Roda com: node scripts/generate-icons.mjs  (depende de sharp, inclusa no Next)
import sharp from "sharp"
import { mkdir } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, "..", "public", "icons")

const BG = "#292a2d"
const FG = "#b538d7"

function svg(size, opts = {}) {
  const pad = opts.maskable ? size * 0.1 : 0 // safe zone p/ maskable
  const fontSize = size * 0.6
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="${BG}"/>
  <text x="50%" y="50%" dy="${fontSize * 0.34}"
        font-family="DM Sans, Arial, sans-serif" font-weight="700"
        font-size="${fontSize}" fill="${FG}"
        text-anchor="middle">${"M"}</text>
</svg>`
}

async function main() {
  await mkdir(outDir, { recursive: true })
  const targets = [
    { name: "192.png", size: 192, maskable: false },
    { name: "512.png", size: 512, maskable: false },
    { name: "512-maskable.png", size: 512, maskable: true },
  ]
  for (const t of targets) {
    await sharp(Buffer.from(svg(t.size, { maskable: t.maskable })))
      .png()
      .toFile(join(outDir, t.name))
    console.log("gerou", t.name)
  }
  console.log("OK — ícones em public/icons/")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
