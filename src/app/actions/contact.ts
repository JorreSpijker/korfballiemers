"use server";

import { CONTACT_SUBJECTS, isContactSubject } from "@/lib/contact-subjects";
import { verifyRecaptcha } from "@/lib/recaptcha";

const CONTACT_EMAIL = "liemerscitykorfbal@gmail.com";
// Werkt zonder geverifieerd domein; vervang door eigen adres zodra het domein in Resend is geverifieerd
const FROM = "Contactformulier Liemers <onboarding@resend.dev>";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Field = "name" | "email" | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<Field, string>>;
  values?: Record<Field, string>;
};

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const subject = String(formData.get("subject") ?? "");
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  if (!isContactSubject(subject)) {
    return { status: "error", message: "Kies een onderwerp.", values };
  }

  const errors: ContactState["errors"] = {};
  if (!values.name) errors.name = "Vul je naam in.";
  else if (values.name.length > 100) errors.name = "Naam is te lang.";
  if (!EMAIL_PATTERN.test(values.email)) errors.email = "Vul een geldig e-mailadres in.";
  if (values.message.length < 10) errors.message = "Je bericht is te kort.";
  else if (values.message.length > 5000) errors.message = "Je bericht is te lang (max. 5000 tekens).";

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values };
  }

  if (!(await verifyRecaptcha(String(formData.get("g-recaptcha-response") ?? "")))) {
    return {
      status: "error",
      message: "Vink 'Ik ben geen robot' aan en probeer het opnieuw.",
      values,
    };
  }

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
      subject: `${CONTACT_SUBJECTS[subject]}: bericht van ${values.name}`,
      text: `Onderwerp: ${CONTACT_SUBJECTS[subject]}\nNaam: ${values.name}\nE-mail: ${values.email}\n\n${values.message}`,
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

  return { status: "success", message: "Bedankt! We nemen zo snel mogelijk contact met je op." };
}
