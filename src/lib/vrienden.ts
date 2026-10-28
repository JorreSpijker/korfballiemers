// Gedeeld door het vriendenformulier (client) en de server action
// Per bedrag een eigen Rabobank-betaalverzoek; de QR in public/ verwijst naar hetzelfde verzoek
export const VRIENDEN_OPTIONS = {
  "20": {
    amount: 20,
    payUrl: "https://betaalverzoek.rabobank.nl/betaalverzoek/?id=nJggJxrVRGqEqUeRic7rWQ",
    qrSrc: "/vrienden-qr-20.png",
  },
  "50": {
    amount: 50,
    payUrl: "https://betaalverzoek.rabobank.nl/betaalverzoek/?id=N8Y11oRsRpG_ARxdohY15A",
    qrSrc: "/vrienden-qr-50.png",
  },
} as const;

export type VriendenOption = keyof typeof VRIENDEN_OPTIONS;

export function isVriendenOption(value: string): value is VriendenOption {
  return value in VRIENDEN_OPTIONS;
}

export function formatEuro(amount: number) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(amount);
}
