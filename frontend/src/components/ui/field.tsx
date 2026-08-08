import { cn } from "@/lib/utils";

/**
 * Form alanları — üç form da (iletişim, teklif, katalog talebi) aynı
 * görünümü paylaşsın diye tek yerde.
 *
 * Girdiler çerçevesiz; yalnızca alt çizgi var. Odaklanınca çizgi vurgu
 * rengine döner (koyu ve aydınlık temada token'lardan boyanır).
 */
const base =
  "w-full border-b border-line bg-transparent py-3 text-fg placeholder:text-fg-faint transition-colors duration-300 focus:border-accent focus:outline-none";

export function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="edge-note text-fg-faint">{label}</span>
      {children}
      {hint ? <span className="text-[0.8rem] text-fg-faint">{hint}</span> : null}
    </label>
  );
}

export function Input({
  className,
  ...rest
}: React.ComponentProps<"input">) {
  return <input className={cn(base, className)} {...rest} />;
}

export function Textarea({
  className,
  ...rest
}: React.ComponentProps<"textarea">) {
  return <textarea className={cn(base, "resize-y", className)} {...rest} />;
}

export function Select({
  className,
  children,
  ...rest
}: React.ComponentProps<"select">) {
  return (
    <select className={cn(base, "text-fg", className)} {...rest}>
      {children}
    </select>
  );
}

/** Gönderim sonrası kullanıcıya dönen tek satırlık durum mesajı. */
export function FormStatus({
  state,
}: {
  state: { status: string; message?: string };
}) {
  if (state.status !== "ok" && state.status !== "error") return null;

  return (
    <p
      role="status"
      className={cn(
        "animate-fade-up text-[0.9rem]",
        state.status === "ok" ? "text-accent" : "text-fg",
      )}
    >
      {state.message}
    </p>
  );
}
