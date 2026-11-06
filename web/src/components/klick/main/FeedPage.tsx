"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import KlickMain from "./KlickMain";
import { genderFromParam, type Surface } from "@/lib/klick/routes";

function Feed({ surface }: { surface: Surface }) {
  const gender = genderFromParam(useSearchParams().get("perfil"));
  return <KlickMain layout={surface} initialGender={gender} />;
}

/** Página de feed compartida por `/web/feed` y `/app/feed`. */
export default function FeedPage({ surface }: { surface: Surface }) {
  return (
    <Suspense fallback={<div className="h-[100dvh] bg-black" />}>
      <Feed surface={surface} />
    </Suspense>
  );
}
