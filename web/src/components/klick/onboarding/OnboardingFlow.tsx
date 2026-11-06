"use client";

import { useState } from "react";
import LegalStep from "./LegalStep";
import BasicInfoStep from "./BasicInfoStep";
import NotificationsStep from "./NotificationsStep";
import PhotosStep from "./PhotosStep";
import VerificationStep from "./VerificationStep";
import IcebreakersStep from "./IcebreakersStep";
import PreferencesStep from "./PreferencesStep";
import TutorialStep from "./TutorialStep";

type Step =
  | "legal"
  | "basic-info"
  | "notifications"
  | "photos"
  | "verification"
  | "icebreakers"
  | "preferences"
  | "tutorial";

interface OnboardingFlowProps {
  /** Volver desde el primer paso (al login). */
  onExit: () => void;
  /** Fin del tutorial; recibe el género elegido para abrir el feed correspondiente. */
  onFinish: (gender: "male" | "female") => void;
}

export default function OnboardingFlow({ onExit, onFinish }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>("legal");

  // Maqueta: los datos aún no se guardan; al conectar Firebase irán a la callable `saveProfile`.
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    birthday: "",
    height: "",
    gender: "Hombre",
    photos: [] as string[],
    icebreakers: {} as Record<string, string>,
    preferences: {} as any,
  });

  switch (step) {
    case "legal":
      return <LegalStep onBack={onExit} onContinue={() => setStep("basic-info")} />;
    case "basic-info":
      return (
        <BasicInfoStep
          onBack={() => setStep("legal")}
          onContinue={(data: any) => {
            setFormData((prev) => ({
              ...prev,
              firstName: data.firstName,
              lastName: data.lastName,
              nickname: data.nickname,
              birthday: data.birthday,
              height: data.heightValue,
              gender: data.gender,
            }));
            setStep("notifications");
          }}
        />
      );
    case "notifications":
      return <NotificationsStep onBack={() => setStep("basic-info")} onContinue={() => setStep("photos")} />;
    case "photos":
      return (
        <PhotosStep
          onBack={() => setStep("notifications")}
          onContinue={(photos: string[]) => {
            setFormData((prev) => ({ ...prev, photos }));
            setStep("verification");
          }}
        />
      );
    case "verification":
      return <VerificationStep onBack={() => setStep("photos")} onFinish={() => setStep("icebreakers")} />;
    case "icebreakers":
      return (
        <IcebreakersStep
          onBack={() => setStep("verification")}
          onContinue={(icebreakers: Record<string, string>) => {
            setFormData((prev) => ({ ...prev, icebreakers }));
            setStep("preferences");
          }}
        />
      );
    case "preferences":
      return (
        <PreferencesStep
          onBack={() => setStep("icebreakers")}
          onContinue={(preferences: any) => {
            setFormData((prev) => ({ ...prev, preferences }));
            setStep("tutorial");
          }}
        />
      );
    case "tutorial":
      return (
        <TutorialStep
          onBack={() => setStep("preferences")}
          onFinish={() => onFinish(formData.gender === "Hombre" ? "male" : "female")}
        />
      );
  }
}
