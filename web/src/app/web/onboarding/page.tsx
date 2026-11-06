"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import OnboardingFlow from "@/components/klick/onboarding/OnboardingFlow";
import { useAuth } from "@/context/AuthContext";
import { saveOnboardingProfile } from "@/lib/klick/save-profile";
import { feedHref, loginHref } from "@/lib/klick/routes";

export default function WebOnboardingPage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace(loginHref("web"));
    else if (profile?.onboarded) router.replace(feedHref("web"));
  }, [loading, user, profile?.onboarded, router]);

  if (loading || !user || profile?.onboarded) return <div className="min-h-[100dvh] bg-black" />;

  const [firstName = "", ...rest] = (user.displayName ?? "").split(" ");

  return (
    <OnboardingFlow
      initialFirstName={firstName}
      initialLastName={rest.join(" ")}
      onExit={async () => {
        await signOut();
        router.replace(loginHref("web"));
      }}
      onFinish={async (data) => {
        await saveOnboardingProfile(user.uid, data);
        toast.success("¡Tu perfil está listo!");
        // El feed se abre solo cuando `profile.onboarded` llega por la suscripción de AuthContext.
      }}
    />
  );
}
