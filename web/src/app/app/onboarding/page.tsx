"use client";

import { useRouter } from "next/navigation";
import OnboardingFlow from "@/components/klick/onboarding/OnboardingFlow";
import { feedHref, loginHref } from "@/lib/klick/routes";

// Maqueta: en la app el registro real aún no está conectado; al terminar abre el feed de ejemplo.
export default function AppOnboardingPage() {
  const router = useRouter();
  return (
    <OnboardingFlow
      onExit={() => router.push(loginHref("app"))}
      onFinish={(data) => router.push(feedHref("app", data.gender === "Mujer" || data.gender === "Woman" ? "female" : "male"))}
    />
  );
}
