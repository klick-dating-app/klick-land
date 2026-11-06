"use client";

import { useRouter } from "next/navigation";
import OnboardingFlow from "@/components/klick/onboarding/OnboardingFlow";
import { feedHref, loginHref } from "@/lib/klick/routes";

export default function AppOnboardingPage() {
  const router = useRouter();
  return (
    <OnboardingFlow
      onExit={() => router.push(loginHref("app"))}
      onFinish={(gender) => router.push(feedHref("app", gender))}
    />
  );
}
