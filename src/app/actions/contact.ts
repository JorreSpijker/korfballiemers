"use server";

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

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!token) {
    console.error("reCAPTCHA fout: geen token ontvangen");
    return false;
  }

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY ?? "",
      response: token,
    }),
  });
  const data = (await response.json()) as { success: boolean; "error-codes"?: string[] };
  if (!data.success) console.error("reCAPTCHA fout", data["error-codes"]);

  return data.success;
}

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

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
      subject: `Contactformulier: bericht van ${values.name}`,
      text: `Naam: ${values.name}\nE-mail: ${values.email}\n\n${values.message}`,
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
