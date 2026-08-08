"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Field, FormStatus, Input, Select, Textarea } from "@/components/ui/field";
import { site } from "@/content/site";
import { sendContactMessage, type FormState } from "@/lib/api";

const SUBJECTS = [
  "Ürün ve fiyat bilgisi",
  "Özel ölçü üretim",
  "Ölçü ve keşif randevusu",
  "Teslimat / montaj",
  "Satış sonrası servis",
  "Diğer",
];

/** İletişim sayfasının mesaj formu. */
export function ContactForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState({ status: "sending" });

    try {
      const result = await sendContactMessage(data);
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

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="E-posta (isteğe bağlı)">
          <Input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="ornek@eposta.com"
          />
        </Field>
        <Field label="Konu">
          <Select name="subject" defaultValue={SUBJECTS[0]}>
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field
        label="Mesajınız"
        hint="Salonun ölçüsü, ilgilendiğiniz ürün ya da uygun olduğunuz saatleri yazabilirsiniz."
      >
        <Textarea name="message" rows={4} required placeholder="Merhaba…" />
      </Field>

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={state.status === "sending"}
          className="group inline-flex h-12 items-center gap-3 rounded-none bg-accent px-7 font-label text-[0.7rem] tracking-[0.18em] text-ink-950 uppercase transition-colors duration-300 hover:bg-accent-soft disabled:opacity-60"
        >
          {state.status === "sending" ? "Gönderiliyor…" : "Mesajı gönder"}
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
