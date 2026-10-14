"use client";

import Script from "next/script";
import { useActionState } from "react";
import { sendContactMessage, type ContactState } from "@/app/actions/contact";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

// Leeg token als het script geblokkeerd is; de server weigert dat dan netjes
function getRecaptchaToken(): Promise<string> {
  const grecaptcha = window.grecaptcha;
  if (!grecaptcha) return Promise.resolve("");
  return new Promise((resolve) => {
    grecaptcha.ready(() => {
      grecaptcha.execute(SITE_KEY, { action: "contact" }).then(resolve, () => resolve(""));
    });
  });
}

const inputClass =
  "w-full rounded-md border border-[#0F1A17]/15 bg-white px-4 py-3 text-liemers-groen transition-[border-color,box-shadow] duration-200 ease-(--ease-out-quint) placeholder:text-[#0F1A17]/45 focus:border-actie-blauw focus:outline-none focus:ring-4 focus:ring-actie-blauw/15 aria-invalid:border-destructive";

const labelClass = "text-sm font-semibold text-liemers-groen";

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="m-0 text-sm font-medium text-[#B42318]">
      {error}
    </p>
  );
}

export function ContactSection({ id }: { id?: string }) {
  const [state, formAction, pending] = useActionState(
    async (prev: ContactState, formData: FormData) => {
      formData.set("recaptchaToken", await getRecaptchaToken());
      return sendContactMessage(prev, formData);
    },
    { status: "idle" }
  );
  const errors = state.errors ?? {};

  return (
    <section id={id} className="surface-light bg-[#EEF2EF]">
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`}
        strategy="lazyOnload"
      />
      <div className="container flex flex-wrap gap-14 py-24">
        <div className="min-w-0 flex-[1_1_340px]">
          <h2 className="reveal-heading font-heading m-0 text-4xl font-bold leading-[1.05] sm:text-[44px]">
            Neem contact op
          </h2>
          <div className="reveal-grow mt-6 flex h-1 w-24" aria-hidden>
            <span className="flex-1 bg-energie-groen" />
            <span className="flex-1 bg-actie-blauw" />
          </div>
          <p className="mt-6 max-w-[420px] text-lg">
            Vragen over het bid, of wil je meedoen als vrijwilliger of sponsor? Stuur ons een
            bericht, dan nemen we contact met je op.
          </p>
        </div>

        <form action={formAction} noValidate className="flex min-w-0 flex-[1.4_1_480px] flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-name" className={labelClass}>
                Naam
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                defaultValue={state.values?.name}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                className={inputClass}
              />
              <FieldError id="contact-name-error" error={errors.name} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-email" className={labelClass}>
                E-mailadres
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue={state.values?.email}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
                className={inputClass}
              />
              <FieldError id="contact-email-error" error={errors.email} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-message" className={labelClass}>
              Bericht
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={6}
              required
              maxLength={5000}
              defaultValue={state.values?.message}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "contact-message-error" : undefined}
              className={`${inputClass} resize-y`}
            />
            <FieldError id="contact-message-error" error={errors.message} />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-12 items-center rounded-md bg-actie-blauw px-6 font-bold text-white transition-[background-color,transform,opacity] duration-200 ease-(--ease-out-quint) hover:bg-actie-blauw/85 disabled:cursor-wait disabled:opacity-70 motion-safe:active:scale-[0.97]"
            >
              {pending ? "Versturen…" : "Verstuur bericht"}
            </button>
            <p role="status" aria-live="polite" className="m-0 text-[15px] font-semibold">
              {state.status === "success" && (
                <span className="anim-rise inline-block text-energie-groen-donker">{state.message}</span>
              )}
              {state.status === "error" && state.message && (
                <span className="anim-rise inline-block text-[#B42318]">{state.message}</span>
              )}
            </p>
          </div>

          <p className="m-0 text-[13px] text-[#0F1A17]/65">
            We gebruiken je gegevens alleen om je bericht te beantwoorden. Dit formulier is beveiligd
            met reCAPTCHA; het{" "}
            <a href="https://policies.google.com/privacy" className="text-actie-blauw underline">
              privacybeleid
            </a>{" "}
            en de{" "}
            <a href="https://policies.google.com/terms" className="text-actie-blauw underline">
              voorwaarden
            </a>{" "}
            van Google zijn van toepassing.
          </p>
        </form>
      </div>
    </section>
  );
}
