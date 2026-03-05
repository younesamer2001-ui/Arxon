/* ────────────────────────────────────────────
   DESIGN TOKENS (Midnight Opulence)
   ──────────────────────────────────────────── */
export const bgDark = '#050510'
export const cardBg = 'rgba(255,255,255,0.03)'
export const cardBorder = 'rgba(255,255,255,0.06)'
export const textPrimary = '#f4f1eb'
export const textSecondary = 'rgba(255,255,255,0.6)'
export const textMuted = 'rgba(255,255,255,0.35)'

export const complexityColor: Record<string, string> = {
  'Lav': '#4ade80', 'Middels': '#fbbf24', 'Høy': '#f87171',
}

export const MISSED_DEFAULTS: Record<string, number> = {
  daily: 60, weekly: 12, occasionally: 4, rarely: 1, unsure: 8
}
export const JOB_VALUE_DEFAULT = 3000

export const fmtNOK = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1).replace('.', ',')} mill kr` : n.toLocaleString('nb-NO') + ' kr'
