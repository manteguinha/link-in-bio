// Fetcher tipado para SWR.
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Erro ${res.status} ao buscar ${url}`)
  }
  return (await res.json()) as T
}
