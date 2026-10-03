/** Script JSON-LD; "<" é escapado para o conteúdo não fechar a tag (recomendação do Next). */
export default function JsonLd({ dados }: { dados: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados).replace(/</g, "\\u003c") }}
    />
  )
}
