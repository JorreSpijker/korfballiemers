// Gedeeld door het contactformulier (client) en de server action
export const CONTACT_SUBJECTS = {
  algemeen: "Algemene vraag",
  sponsor: "Sponsor worden",
  vrijwilliger: "Vrijwilliger worden",
} as const;

export type ContactSubject = keyof typeof CONTACT_SUBJECTS;

export function isContactSubject(value: string): value is ContactSubject {
  return value in CONTACT_SUBJECTS;
}
