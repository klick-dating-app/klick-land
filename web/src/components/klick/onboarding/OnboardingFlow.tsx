"use client";

import { useState } from "react";
import { toast } from "sonner";
import LegalStep from "./LegalStep";
import BasicInfoStep, { type BasicInfoData } from "./BasicInfoStep";
import NotificationsStep from "./NotificationsStep";
import PhotosStep from "./PhotosStep";
import VerificationStep from "./VerificationStep";
import IcebreakersStep from "./IcebreakersStep";
import PreferencesStep from "./PreferencesStep";
import TutorialStep from "./TutorialStep";
import { imagePhotos, type OnboardingData } from "@/lib/klick/save-profile";

type Step =
  | "legal"
  | "basic-info"
  | "notifications"
  | "photos"
  | "verification"
  | "icebreakers"
  | "preferences"
  | "tutorial"
  | "saving";

interface OnboardingFlowProps {
  /** Volver desde el primer paso (al login). */
  onExit: () => void;
  /** Fin del tutorial con todos los datos. Si devuelve una promesa, se muestra "guardando" hasta que termine. */
  onFinish: (data: OnboardingData) => void | Promise<void>;
  initialFirstName?: string;
  initialLastName?: string;
}

const EMPTY: OnboardingData = {
  firstName: "",
  lastName: "",
  birthday: "",
  gender: "",
  city: "",
  state: "",
  photos: [],
  icebreakers: {},
  preferences: {},
};

export default function OnboardingFlow({ onExit, onFinish, initialFirstName, initialLastName }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>("legal");
  const [data, setData] = useState<OnboardingData>(EMPTY);
  const update = (patch: Partial<OnboardingData>, next: Step) => {
    setData((prev) => ({ ...prev, ...patch }));
    setStep(next);
  };

  const finish = async () => {
    setStep("saving");
    try {
      await onFinish(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      toast.error(message || "No se pudo guardar tu perfil. Inténtalo de nuevo.");
      setStep("tutorial");
    }
  };

  switch (step) {
    case "legal":
      return <LegalStep onBack={onExit} onContinue={() => setStep("basic-info")} />;
    case "basic-info":
      return (
        <BasicInfoStep
          initialFirstName={data.firstName || initialFirstName}
          initialLastName={data.lastName || initialLastName}
          onBack={() => setStep("legal")}
          onContinue={(d: BasicInfoData) =>
            update(
              { firstName: d.firstName, lastName: d.lastName, birthday: d.birthday, gender: d.gender, city: d.city, state: d.state },
              "notifications",
            )
          }
        />
      );
    case "notifications":
      return <NotificationsStep onBack={() => setStep("basic-info")} onContinue={() => setStep("photos")} />;
    case "photos":
      return (
        <PhotosStep
          onBack={() => setStep("notifications")}
          onContinue={(photos: string[]) => {
            if (imagePhotos(photos).length === 0) {
              toast.error("Sube al menos una foto para continuar.");
              return;
            }
            update({ photos }, "verification");
          }}
        />
      );
    case "verification":
      return <VerificationStep onBack={() => setStep("photos")} onFinish={() => setStep("icebreakers")} />;
    case "icebreakers":
      return (
        <IcebreakersStep
          onBack={() => setStep("verification")}
          onContinue={(icebreakers: Record<string, string>) => update({ icebreakers }, "preferences")}
        />
      );
    case "preferences":
      return (
        <PreferencesStep
          onBack={() => setStep("icebreakers")}
          onContinue={(preferences: Record<string, unknown>) => update({ preferences }, "tutorial")}
        />
      );
    case "tutorial":
      return <TutorialStep onBack={() => setStep("preferences")} onFinish={finish} />;
    case "saving":
      return (
        <div className="min-h-[100dvh] w-full bg-black text-white flex flex-col items-center justify-center gap-4">
          <span className="h-10 w-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <p className="text-sm font-light tracking-wide text-white/70">Creando tu perfil…</p>
        </div>
      );
  }
}
