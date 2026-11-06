"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import KlickMain from "./KlickMain";
import { useAuth } from "@/context/AuthContext";
import { genderFromParam, loginHref, onboardingHref, type Surface } from "@/lib/klick/routes";

const Blank = () => <div className="h-[100dvh] bg-black" />;

function Feed({ surface }: { surface: Surface }) {
  const router = useRouter();
  const demoGender = genderFromParam(useSearchParams().get("perfil"));
  const { user, profile, loading } = useAuth();
  const needsLogin = !demoGender && !loading && !user;
  const needsOnboarding = !demoGender && !loading && !!user && !profile?.onboarded;

  useEffect(() => {
    if (needsLogin) router.replace(loginHref(surface));
    else if (needsOnboarding) router.replace(onboardingHref(surface));
  }, [needsLogin, needsOnboarding, router, surface]);

  // `?perfil=` = perfiles de ejemplo sin sesión; sin él, el feed es del usuario logueado.
  if (!demoGender && (loading || needsLogin || needsOnboarding)) return <Blank />;
  return <KlickMain layout={surface} initialGender={demoGender} />;
}

/** Página de feed compartida por `/web/feed` y `/app/feed`. */
export default function FeedPage({ surface }: { surface: Surface }) {
  return (
    <Suspense fallback={<Blank />}>
      <Feed surface={surface} />
    </Suspense>
  );
}
