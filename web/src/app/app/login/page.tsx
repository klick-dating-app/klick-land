"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import KlickAuthFlow, { type AuthMode } from "@/components/klick/auth/KlickAuthFlow";
import { feedHref } from "@/lib/klick/routes";

// Maqueta: en la app los proveedores aún no autentican; registro → onboarding, login → feed.
export default function AppLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode | null>(null);
  const proceed = () => router.push(mode === "login" ? feedHref("app", "male") : "/app/onboarding");

  return (
    <KlickAuthFlow
      variant="app"
      mode={mode}
      onModeChange={setMode}
      onDemoAccess={(gender) => router.push(feedHref("app", gender))}
      onSocial={(provider) => (provider === "phone" ? toast.info("Phone authentication coming soon") : proceed())}
      onEmailSubmit={proceed}
    />
  );
}
