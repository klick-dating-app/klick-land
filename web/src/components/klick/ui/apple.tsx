"use client";

import React, { useState } from "react";
import { Check, ChevronRight, ChevronsUpDown } from "lucide-react";

/**
 * Controles con el lenguaje de Ajustes de Apple: grupos negros (solo un borde fino, sin relleno gris),
 * filas de 44 px separadas por una línea fina con sangría, interruptor tipo iOS,
 * menú emergente con el valor a la derecha y deslizador delgado.
 * Los colores (#39393d, bordes…) tienen su versión clara en `LightThemeStyles`.
 */

export const APPLE_BLUE = "#0a84ff";

/** Sección: título opcional arriba, filas dentro de un bloque redondeado y nota al pie. */
export function Group({ title, footer, children }: { title?: string; footer?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      {title && <h3 className="px-1 text-[13px] font-semibold text-white/90">{title}</h3>}
      <div className="rounded-[14px] bg-black border border-white/[0.12] overflow-hidden pl-4">{children}</div>
      {footer && <p className="px-1 text-[11px] leading-snug text-zinc-500">{footer}</p>}
    </section>
  );
}

/** Fila base: etiqueta a la izquierda, control a la derecha, línea inferior con sangría. */
export function Row({
  label,
  hint,
  children,
  onClick,
}: {
  label: React.ReactNode;
  hint?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] text-white leading-snug">{label}</span>
        {hint && <span className="block text-[11px] text-zinc-500 leading-snug mt-0.5">{hint}</span>}
      </span>
      {children}
    </>
  );
  const cls =
    "relative w-full min-h-[44px] flex items-center gap-3 pr-4 py-2.5 text-left border-b border-white/[0.08] last:border-b-0";
  return onClick ? (
    <button type="button" onClick={onClick} className={`${cls} cursor-pointer active:bg-white/[0.04]`}>
      {body}
    </button>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/** Interruptor tipo iOS (51 × 31). */
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-200 cursor-pointer ${
        checked ? "bg-[#0a84ff]" : "bg-[#39393d]"
      }`}
    >
      <span
        className={`absolute top-[2px] left-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.16)] transition-transform duration-200 ${
          checked ? "translate-x-[20px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function ToggleRow({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Row label={label} hint={hint}>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </Row>
  );
}

/**
 * Menú emergente: muestra el valor y ⌃⌄ como en macOS; el `<select>` nativo va encima
 * (invisible) para que en iPhone/Android se abra la rueda o lista del sistema.
 */
export function SelectRow({
  label,
  hint,
  value,
  options,
  onChange,
  placeholder = "Not set",
  allowEmpty = true,
}: {
  label: string;
  hint?: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  placeholder?: string;
  allowEmpty?: boolean;
}) {
  return (
    <Row label={label} hint={hint}>
      <span className="relative flex items-center gap-1.5 max-w-[55%]">
        <span className={`truncate text-[14px] ${value ? "text-zinc-400" : "text-zinc-600"}`}>{value || placeholder}</span>
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
        <select
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        >
          {(allowEmpty || !value) && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </span>
    </Row>
  );
}

/**
 * Selección múltiple: una fila con el resumen que, al tocarla, despliega la lista
 * con ✓ a la derecha (como las listas de Ajustes), en vez de muchas cápsulas.
 */
export function MultiSelectRow({
  label,
  hint,
  value,
  options,
  onChange,
  emptyLabel = "Any",
  exclusive,
}: {
  label: string;
  hint?: string;
  value: string[];
  options: readonly string[];
  onChange: (v: string[]) => void;
  emptyLabel?: string;
  /** Opción que excluye a las demás (p. ej. "No preference"). */
  exclusive?: string;
}) {
  const [open, setOpen] = useState(false);
  const summary = value.length === 0 ? emptyLabel : value.length <= 2 ? value.join(", ") : `${value.slice(0, 2).join(", ")} +${value.length - 2}`;
  const toggle = (o: string) => {
    if (value.includes(o)) return onChange(value.filter((x) => x !== o));
    if (exclusive && o === exclusive) return onChange([o]);
    onChange([...value.filter((x) => x !== exclusive), o]);
  };
  return (
    <>
      <Row label={label} hint={hint} onClick={() => setOpen((v) => !v)}>
        <span className="truncate max-w-[50%] text-[14px] text-zinc-400">{summary}</span>
        <ChevronRight className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
      </Row>
      {open &&
        options.map((o) => (
          <Row key={o} label={<span className="pl-3 text-zinc-200">{o}</span>} onClick={() => toggle(o)}>
            {value.includes(o) && <Check className="h-4 w-4 shrink-0 text-[#0a84ff]" strokeWidth={2.5} />}
          </Row>
        ))}
    </>
  );
}

/** Deslizador delgado con perilla blanca; `format` da el texto del valor a la derecha. */
export function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format = String,
  minLabel,
  maxLabel,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  minLabel?: string;
  maxLabel?: string;
}) {
  const fill = `${((value - min) / (max - min)) * 100}%`;
  return (
    <div className="pr-4 py-3 border-b border-white/[0.08] last:border-b-0">
      <div className="flex items-center justify-between">
        <span className="text-[14px] text-white">{label}</span>
        <span className="text-[14px] text-zinc-400 tabular-nums">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="k-range mt-2"
        style={{ "--k-fill": fill } as React.CSSProperties}
      />
      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-[11px] text-zinc-500 -mt-0.5">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}

/** Campo de texto en línea, alineado a la derecha como en Ajustes. */
export function TextRow({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  maxLength?: number;
}) {
  return (
    <Row label={label}>
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
        className="w-[55%] bg-transparent text-right text-[14px] text-zinc-300 placeholder:text-zinc-600 outline-none"
      />
    </Row>
  );
}

/** Fila de solo lectura (etiqueta · valor) para mostrar datos de un perfil. */
export function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Row label={<span className="text-zinc-400">{label}</span>}>
      <span className="max-w-[62%] text-right text-[14px] text-white leading-snug">{value}</span>
    </Row>
  );
}

/**
 * Botón principal de ancho completo. `solid`: blanco (estilo prominente de Apple);
 * `gradient`: el degradado de marca de "I Arrived Safely", para las acciones finales (aplicar, guardar).
 */
export function PrimaryButton({
  children,
  onClick,
  variant = "solid",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "solid" | "gradient";
}) {
  const look =
    variant === "gradient"
      ? "klick-keep-white bg-[linear-gradient(90deg,#008aff_0%,#7c3aed_45%,#ff007f_100%)] text-white shadow-md"
      : "k-primary bg-white text-black";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${look} w-full h-[50px] rounded-full text-[15px] font-semibold active:scale-[0.98] transition-transform cursor-pointer`}
    >
      {children}
    </button>
  );
}
