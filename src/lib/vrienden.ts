// Gedeeld door het vriendenformulier (client) en de server action
// Per bedrag een eigen Rabobank-betaalverzoek; de QR in public/ verwijst naar hetzelfde verzoek
export const VRIENDEN_OPTIONS = {
  "15": {
    amount: 15,
    payUrl: "https://betaalverzoek.rabobank.nl/betaalverzoek/?id=y4VGFQMETr28whtyBYd1jA",
    qrSrc: "/vrienden-qr-15.png",
  },
  "25": {
    amount: 25,
    payUrl: "https://betaalverzoek.rabobank.nl/betaalverzoek/?id=INxIVDK-S8aCQoYxVpXKsw",
    qrSrc: "/vrienden-qr-25.png",
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
