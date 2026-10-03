import { PROFILE, REDES_SOCIAIS, SITE } from "./constants"

/** Dados estruturados (schema.org) da página: quem é o Marcos e para onde os links levam. */
export function jsonLdDaPagina() {
  const pessoa = {
    "@type": "Person",
    "@id": `${SITE.url}/#pessoa`,
    name: PROFILE.nome,
    url: PROFILE.site,
    image: PROFILE.avatarUrl,
    description: SITE.description,
    sameAs: [...REDES_SOCIAIS.map((rede) => rede.href), PROFILE.site],
  }
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${SITE.url}/#pagina`,
        url: `${SITE.url}/`,
        name: SITE.title,
        inLanguage: "pt-BR",
        mainEntity: { "@id": pessoa["@id"] },
      },
      pessoa,
    ],
  }
}
