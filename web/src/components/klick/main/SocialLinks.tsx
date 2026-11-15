"use client";

import Image from "next/image";
import { toast } from "sonner";
import { DEMO_HANDLE, SOCIALS } from "@/lib/klick/socials";
import type { SocialNetwork } from "@/lib/types";

interface SocialLinksProps {
  socials?: Partial<Record<SocialNetwork, string>>;
  /** WhatsApp es un número de teléfono: solo se abre después de hacer Klick (hoja "Seguridad"). */
  canOpenWhatsApp?: boolean;
  size?: number;
  /** Columna (a la derecha de la primera foto) o fila. */
  vertical?: boolean;
}

/** Iconos de redes de una persona: los conectados se abren; los demás quedan atenuados. */
export default function SocialLinks({ socials = {}, canOpenWhatsApp = false, size = 24, vertical = false }: SocialLinksProps) {
  return (
    <div className={vertical ? "flex flex-col items-center gap-4" : "flex items-center gap-1.5"}>
      {SOCIALS.map((s) => {
        const handle = socials[s.id];
        const icon = (
          <Image
            src={s.icon}
            alt={s.label}
            width={size}
            height={size}
            unoptimized={s.icon.endsWith(".svg")}
            className="rounded-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.55)]"
            style={{ width: size, height: size }}
          />
        );
        if (!handle) {
          return (
            <span key={s.id} title={`${s.label} · not connected`} className="opacity-30 grayscale">
              {icon}
            </span>
          );
        }
        const locked = s.id === "whatsapp" && !canOpenWhatsApp;
        if (handle === DEMO_HANDLE || locked) {
          return (
            <button
              key={s.id}
              type="button"
              title={s.label}
              onClick={(e) => {
                e.stopPropagation();
                toast(locked ? "WhatsApp unlocks after you both Klick." : `${s.label} opens on real profiles.`);
              }}
              className="active:scale-90 transition-transform cursor-pointer"
            >
              {icon}
            </button>
          );
        }
        return (
          <a
            key={s.id}
            href={s.url(handle)}
            target="_blank"
            rel="noopener noreferrer"
            title={s.label}
            onClick={(e) => e.stopPropagation()}
            className="active:scale-90 transition-transform"
          >
            {icon}
          </a>
        );
      })}
    </div>
  );
}
