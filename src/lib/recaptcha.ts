// Gedeeld door de server actions van het contact- en vriendenformulier
export async function verifyRecaptcha(token: string): Promise<boolean> {
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
