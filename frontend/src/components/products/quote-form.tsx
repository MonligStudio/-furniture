"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Field, FormStatus, Input, Textarea } from "@/components/ui/field";
import { sendQuoteRequest, type FormState } from "@/lib/api";
import { site } from "@/content/site";

/**
 * Ürün detayındaki "fiyat ve bilgi iste" formu.
 *
 * Backend kapalıysa kullanıcı boşta kalmasın diye hata mesajı telefon
 * numarasını da söyler.
 */
export function QuoteForm({
  productSlug,
  productName,
}: {
  productSlug: string;
  productName: string;
}) {
  const [state, setState] = useState<FormState>({ status: "idle" });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState({ status: "sending" });

    try {
      const result = await sendQuoteRequest({ ...data, productSlug, productName });
      setState({ status: "ok", message: result.message });
      form.reset();
    } catch (error) {
      setState({
        status: "error",
        message: `${(error as Error).message} Dilerseniz ${site.contact.phone} numarasından bize ulaşın.`,
      });
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Ad soyad">
          <Input name="name" required autoComplete="name" placeholder="Adınız" />
        </Field>
        <Field label="Telefon">
          <Input
            name="phone"
            required
            type="tel"
            autoComplete="tel"
            placeholder="05xx xxx xx xx"
          />
        </Field>
      </div>

      <Field label="E-posta (isteğe bağlı)">
        <Input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ornek@eposta.com"
        />
      </Field>

      <Field
        label="Notunuz"
        hint="Salonun ölçüsü, tercih ettiğiniz kumaş ya da renk gibi detayları yazabilirsiniz."
      >
        <Textarea
          name="message"
          rows={3}
          placeholder={`${productName} hakkında bilgi almak istiyorum.`}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={state.status === "sending"}
          className="group inline-flex h-12 items-center gap-3 rounded-none bg-accent px-7 font-label text-[0.7rem] tracking-[0.18em] text-ink-950 uppercase transition-colors duration-300 hover:bg-accent-soft disabled:opacity-60"
        >
          {state.status === "sending" ? "Gönderiliyor…" : "Bilgi iste"}
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.5}
            aria-hidden
          />
        </button>

        <FormStatus state={state} />
      </div>
    </form>
  );
}
