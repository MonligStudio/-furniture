"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Field, FormStatus, Input, Select } from "@/components/ui/field";
import { catalogs } from "@/content/catalog";
import { site } from "@/content/site";
import { sendCatalogRequest, type FormState } from "@/lib/api";

/**
 * "Kataloğu PDF olarak gönderin" formu.
 *
 * Katalogların PDF'i henüz sitede tutulmuyor (bkz. catalogs.json → pdfUrl);
 * talep backend'e düşüyor, mağaza dosyayı e-posta ile gönderiyor. PDF'ler
 * siteye eklenince bu form yerini doğrudan indirme bağlantısına bırakabilir.
 */
export function CatalogRequestForm({
  defaultCatalog,
}: {
  defaultCatalog?: string;
}) {
  const [state, setState] = useState<FormState>({ status: "idle" });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState({ status: "sending" });

    try {
      const result = await sendCatalogRequest(data);
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
        <Field label="E-posta">
          <Input
            name="email"
            required
            type="email"
            autoComplete="email"
            placeholder="ornek@eposta.com"
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Telefon (isteğe bağlı)">
          <Input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="05xx xxx xx xx"
          />
        </Field>
        <Field label="Katalog">
          <Select name="catalogSlug" defaultValue={defaultCatalog ?? "hepsi"}>
            <option value="hepsi">Tüm kataloglar</option>
            {catalogs.map((catalog) => (
              <option key={catalog.slug} value={catalog.slug}>
                {catalog.title}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={state.status === "sending"}
          className="group inline-flex h-12 items-center gap-3 rounded-none bg-accent px-7 font-label text-[0.7rem] tracking-[0.18em] text-ink-950 uppercase transition-colors duration-300 hover:bg-accent-soft disabled:opacity-60"
        >
          {state.status === "sending" ? "Gönderiliyor…" : "PDF gönderin"}
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.5}
            aria-hidden
          />
        </button>

        <FormStatus state={state} />
      </div>

      <p className="text-[0.8rem] text-fg-faint">
        Bilgileriniz yalnızca katalog gönderimi için kullanılır, üçüncü
        kişilerle paylaşılmaz.
      </p>
    </form>
  );
}
