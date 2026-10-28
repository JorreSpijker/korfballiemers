"use client";

import Image from "next/image";
import Script from "next/script";
import { useActionState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { sendVriendenAanmelding, type VriendenState } from "@/app/actions/vrienden";
import { FieldError, inputClass, labelClass } from "@/components/contact-section";
import { VRIENDEN_OPTIONS, formatEuro } from "@/lib/vrienden";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

export function VriendenForm() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);

  // Expliciet renderen, zodat het vinkje ook verschijnt na client-navigatie
  const renderWidget = () => {
    const grecaptcha = window.grecaptcha;
    grecaptcha?.ready(() => {
      if (!widgetRef.current || widgetId.current !== null) return;
      widgetId.current = grecaptcha.render(widgetRef.current, { sitekey: SITE_KEY });
    });
  };

  const [state, formAction, pending] = useActionState(
    async (prev: VriendenState, formData: FormData) => {
      const result = await sendVriendenAanmelding(prev, formData);
      // Een token is maar één keer geldig
      window.grecaptcha?.reset(widgetId.current ?? undefined);
      return result;
    },
    { status: "idle" }
  );
  const errors = state.errors ?? {};

  if (state.status === "success" && state.option) {
    const { amount, payUrl, qrSrc } = VRIENDEN_OPTIONS[state.option];
    return (
      <aside role="status" className="anim-rise rounded-2xl bg-[#EEF2EF] p-6 sm:p-8">
        <h2 className="font-heading m-0 text-2xl font-bold">Bedankt, je aanmelding is binnen!</h2>
        <p className="mt-3 mb-6 text-liemers-groen">
          Rond je bijdrage van <strong>{formatEuro(amount)}</strong> af door de QR-code te
          scannen met je bank-app. Op je telefoon? Gebruik dan de knop.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <Image
            src={qrSrc}
            alt="QR-code voor het betaalverzoek"
            width={200}
            height={200}
            className="rounded-md bg-white p-2"
          />
          <a
            href={payUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center rounded-md bg-actie-blauw px-6 font-bold text-white transition-[background-color,transform] duration-200 ease-(--ease-out-quint) hover:bg-actie-blauw/85 hover:text-white motion-safe:active:scale-[0.97]"
          >
            Open betaalverzoek
          </a>
        </div>
      </aside>
    );
  }

  return (
    <>
      <Script
        src="https://www.google.com/recaptcha/api.js?render=explicit&hl=nl"
        strategy="lazyOnload"
        onReady={renderWidget}
      />
      <form action={formAction} noValidate className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="vrienden-name" className={labelClass}>
              Naam
            </label>
            <input
              id="vrienden-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={100}
              defaultValue={state.values?.name}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "vrienden-name-error" : undefined}
              className={inputClass}
            />
            <FieldError id="vrienden-name-error" error={errors.name} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="vrienden-email" className={labelClass}>
              E-mailadres
            </label>
            <input
              id="vrienden-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              defaultValue={state.values?.email}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "vrienden-email-error" : undefined}
              className={inputClass}
            />
            <FieldError id="vrienden-email-error" error={errors.email} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="vrienden-phone" className={labelClass}>
              Telefoonnummer (optioneel)
            </label>
            <input
              id="vrienden-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={15}
              defaultValue={state.values?.phone}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "vrienden-phone-error" : undefined}
              className={inputClass}
            />
            <FieldError id="vrienden-phone-error" error={errors.phone} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="vrienden-amount" className={labelClass}>
              Bedrag
            </label>
            <div className="relative">
              <select
                id="vrienden-amount"
                name="amount"
                required
                defaultValue={state.values?.amount ?? "50"}
                aria-invalid={!!errors.amount}
                aria-describedby={errors.amount ? "vrienden-amount-error" : undefined}
                className={`${inputClass} appearance-none pr-11`}
              >
                {Object.entries(VRIENDEN_OPTIONS).map(([value, { amount }]) => (
                  <option key={value} value={value}>
                    {formatEuro(amount)}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[#0F1A17]/55"
              />
            </div>
            <FieldError id="vrienden-amount-error" error={errors.amount} />
          </div>
        </div>

        <div ref={widgetRef} className="min-h-[78px]" />

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-12 items-center rounded-md bg-actie-blauw px-6 font-bold text-white transition-[background-color,transform,opacity] duration-200 ease-(--ease-out-quint) hover:bg-actie-blauw/85 disabled:cursor-wait disabled:opacity-70 motion-safe:active:scale-[0.97]"
          >
            {pending ? "Versturen…" : "Word vriend"}
          </button>
          <p role="status" aria-live="polite" className="m-0 text-[15px] font-semibold">
            {state.status === "error" && state.message && (
              <span className="anim-rise inline-block text-[#B42318]">{state.message}</span>
            )}
          </p>
        </div>

        <p className="m-0 text-[13px] text-[#0F1A17]/65">
          Na het versturen krijg je een betaalverzoek te zien. We gebruiken je gegevens alleen voor
          de Vrienden van LiemersCity Korfbal.
        </p>
      </form>
    </>
  );
}
