import { describe, expect, it } from "vitest"
import robots from "@/app/robots"
import sitemap from "@/app/sitemap"

describe("sitemap", () => {
  it("lista a página inicial com a URL absoluta", () => {
    expect(sitemap().map((entrada) => entrada.url)).toEqual(["https://bio.mvms.dev/"])
  })
})

describe("robots", () => {
  it("libera a página para os buscadores e aponta para o sitemap", () => {
    const resultado = robots()
    expect(resultado.rules).toEqual({ userAgent: "*", allow: "/" })
    expect(resultado.sitemap).toBe("https://bio.mvms.dev/sitemap.xml")
  })
})
