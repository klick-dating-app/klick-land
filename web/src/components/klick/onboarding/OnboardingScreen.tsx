"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import OnboardingFlow from "@/components/klick/onboarding/OnboardingFlow";
import { useAuth } from "@/context/AuthContext";
import { saveOnboardingProfile } from "@/lib/klick/save-profile";
import { feedHref, loginHref, type Surface } from "@/lib/klick/routes";
import { subscribeHref, takePendingPlan } from "@/lib/payments/subscription-plans";

/** Onboarding real (guarda el perfil con `saveProfile`) compartido por `/web/onboarding` y `/app/onboarding`. */
export default function OnboardingScreen({ surface }: { surface: Surface }) {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace(loginHref(surface));
    else if (profile?.onboarded) {
      const plan = takePendingPlan();
      router.replace(plan ? subscribeHref(plan) : feedHref(surface));
    }
  }, [loading, user, profile?.onboarded, router]);

  if (loading || !user || profile?.onboarded) return <div className="min-h-[100dvh] bg-black" />;

  const [firstName = "", ...rest] = (user.displayName ?? "").split(" ");

  return (
    <OnboardingFlow
      initialFirstName={firstName}
      initialLastName={rest.join(" ")}
      onExit={async () => {
        await signOut();
        router.replace(loginHref(surface));
      }}
      onFinish={async (data) => {
        await saveOnboardingProfile(user.uid, data);
        toast.success("¡Tu perfil está listo!");
        // El feed se abre solo cuando `profile.onboarded` llega por la suscripción de AuthContext.
      }}
    />
  );
}
