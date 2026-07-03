// Eventos especiais do calendário, no fuso America/Sao_Paulo.
export type EventoEspecial = {
  mes: number // 1-12
  dia: number // 1-31
  mensagem: string
  icone: string // emoji ou vazio
}

export const EVENTOS_ESPECIAIS: EventoEspecial[] = [
  { mes: 12, dia: 25, mensagem: "Feliz Natal!", icone: "🎄" },
  { mes: 1, dia: 1, mensagem: "Feliz Ano Novo!", icone: "🥂" },
]

/** Retorna o evento especial para hoje (dd/mm no fuso de São Paulo), se houver. */
export function eventoDeHoje(mes: number, dia: number): EventoEspecial | null {
  return EVENTOS_ESPECIAIS.find((e) => e.mes === mes && e.dia === dia) ?? null
}

/** Range de "horário de sono" para mostrar o ícone de snooze (0h–6h). */
export function ehSnooze(hora: number): boolean {
  return hora >= 0 && hora < 6
}
