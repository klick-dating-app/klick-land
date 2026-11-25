"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import KlickMain from "./KlickMain";
import { useAuth } from "@/context/AuthContext";
import { loginHref, onboardingHref, type Surface } from "@/lib/klick/routes";

const Blank = () => <div className="h-[100dvh] bg-black" />;

function Feed({ surface }: { surface: Surface }) {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const needsLogin = !loading && !user;
  const needsOnboarding = !loading && !!user && !profile?.onboarded;

  useEffect(() => {
    if (needsLogin) router.replace(loginHref(surface));
    else if (needsOnboarding) router.replace(onboardingHref(surface));
  }, [needsLogin, needsOnboarding, router, surface]);

  // El feed es siempre del usuario con sesión y perfil completo; su género decide qué perfiles ve.
  if (loading || needsLogin || needsOnboarding) return <Blank />;
  return <KlickMain layout={surface} />;
}

/** Página de feed compartida por `/web/feed` y `/app/feed`. */
export default function FeedPage({ surface }: { surface: Surface }) {
  return (
    <Suspense fallback={<Blank />}>
      <Feed surface={surface} />
    </Suspense>
  );
}
