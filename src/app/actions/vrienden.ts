"use server";

import { verifyRecaptcha } from "@/lib/recaptcha";
import { VRIENDEN_OPTIONS, formatEuro, isVriendenOption, type VriendenOption } from "@/lib/vrienden";

const CONTACT_EMAIL = "liemerscitykorfbal@gmail.com";
// Werkt zonder geverifieerd domein; vervang door eigen adres zodra het domein in Resend is geverifieerd
const FROM = "Vrienden van LiemersCity Korfbal <onboarding@resend.dev>";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s-]{10,15}$/;

type Field = "name" | "email" | "phone" | "amount";

export type VriendenState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<Field, string>>;
  values?: Record<Field, string>;
  option?: VriendenOption;
};

// Google Apps Script web app die een regel aan de Sheet toevoegt; de mail is leidend, dus fouten alleen loggen
async function addToSheet(row: Record<string, string>) {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) {
    console.error("Google Sheet fout: GOOGLE_SHEET_WEBHOOK_URL ontbreekt");
    return;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });
    if (!response.ok) console.error("Google Sheet fout", response.status, await response.text());
  } catch (error) {
    console.error("Google Sheet fout", error);
  }
}

export async function sendVriendenAanmelding(
  _prev: VriendenState,
  formData: FormData
): Promise<VriendenState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    amount: String(formData.get("amount") ?? "").trim(),
  };

  const errors: VriendenState["errors"] = {};
  if (!values.name) errors.name = "Vul je naam in.";
  else if (values.name.length > 100) errors.name = "Naam is te lang.";
  if (!EMAIL_PATTERN.test(values.email)) errors.email = "Vul een geldig e-mailadres in.";
  if (values.phone && !PHONE_PATTERN.test(values.phone)) errors.phone = "Vul een geldig telefoonnummer in.";
  if (!isVriendenOption(values.amount)) errors.amount = "Kies een bedrag.";

  if (Object.keys(errors).length > 0 || !isVriendenOption(values.amount)) {
    return { status: "error", errors, values };
  }
  const option = values.amount;
  const { amount } = VRIENDEN_OPTIONS[option];

  if (!(await verifyRecaptcha(String(formData.get("g-recaptcha-response") ?? "")))) {
    return {
      status: "error",
      message: "Vink 'Ik ben geen robot' aan en probeer het opnieuw.",
      values,
    };
  }

  const bedrag = formatEuro(amount);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: CONTACT_EMAIL,
      reply_to: values.email,
      subject: `Nieuwe vriend: ${values.name} (${bedrag})`,
      text: `Naam: ${values.name}\nE-mail: ${values.email}\nTelefoon: ${values.phone}\nBedrag: ${bedrag}\n\nLet op: de betaling loopt via het betaalverzoek en is nog niet gecontroleerd.`,
    }),
  });

  if (!response.ok) {
    console.error("Resend fout", response.status, await response.text());
    return {
      status: "error",
      message: "Versturen is mislukt. Probeer het later opnieuw.",
      values,
    };
  }

  await addToSheet({
    datum: new Date().toISOString(),
    naam: values.name,
    email: values.email,
    telefoon: values.phone,
    bedrag: amount.toFixed(2),
  });

  return { status: "success", option };
}
