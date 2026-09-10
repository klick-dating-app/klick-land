"use client";

import React, { useState } from "react";
import MobileAppWelcome from "./MobileAppWelcome";
import MobileAppLegal from "./MobileAppLegal";
import MobileAppBasicInfo from "./MobileAppBasicInfo";
import MobileAppNotifications from "./MobileAppNotifications";
import MobileAppPhotos from "./MobileAppPhotos";
import MobileAppVerification from "./MobileAppVerification";
import MobileAppIcebreakers from "./MobileAppIcebreakers";
import MobileAppPreferences from "./MobileAppPreferences";
import MobileAppTutorial from "./MobileAppTutorial";
import MobileAppMainFeed from "./MobileAppMainFeed";

export type AppStep =
  | "welcome"
  | "legal"
  | "basic-info"
  | "notifications"
  | "photos"
  | "verification"
  | "icebreakers"
  | "preferences"
  | "tutorial"
  | "feed";

export default function MobileAppContainer() {
  const [currentStep, setCurrentStep] = useState<AppStep>("welcome");

  const [formData, setFormData] = useState({
    firstName: "Juan Carlos",
    lastName: "Morales",
    nickname: "juancarlos_m",
    birthday: "",
    height: "5' 10\"",
    gender: "Hombre",
    photos: [] as string[],
    icebreakers: {} as Record<string, string>,
    preferences: {} as any,
  });

  // Paso 0: Welcome -> Legal
  const handleStartAuth = () => {
    setCurrentStep("legal");
  };

  // Paso 1: Legal -> Basic Info
  const handleContinueFromLegal = () => {
    setCurrentStep("basic-info");
  };

  // Paso 2: Basic Info -> Notifications
  const handleContinueFromBasicInfo = (data: any) => {
    setFormData((prev) => ({
      ...prev,
      firstName: data.firstName,
      lastName: data.lastName,
      nickname: data.nickname || "juancarlos_m",
      birthday: data.birthday,
      height: data.heightValue,
      gender: data.gender,
    }));
    setCurrentStep("notifications");
  };

  // Paso 3: Notifications -> Photos
  const handleContinueFromNotifications = () => {
    setCurrentStep("photos");
  };

  // Paso 4: Photos -> Verification
  const handleContinueFromPhotos = (uploadedPhotos: string[]) => {
    setFormData((prev) => ({ ...prev, photos: uploadedPhotos }));
    setCurrentStep("verification");
  };

  // Paso 5: Verification -> Icebreakers
  const handleContinueFromVerification = () => {
    setCurrentStep("icebreakers");
  };

  // Paso 6: Icebreakers -> Preferences
  const handleContinueFromIcebreakers = (answers: Record<string, string>) => {
    setFormData((prev) => ({ ...prev, icebreakers: answers }));
    setCurrentStep("preferences");
  };

  // Paso 7: Preferences -> Tutorial
  const handleContinueFromPreferences = (prefs: any) => {
    setFormData((prev) => ({ ...prev, preferences: prefs }));
    setCurrentStep("tutorial");
  };

  // Paso 8: Tutorial -> Main Feed
  const handleFinishTutorial = () => {
    setCurrentStep("feed");
  };

  if (currentStep === "legal") {
    return (
      <MobileAppLegal
        onBack={() => setCurrentStep("welcome")}
        onContinue={handleContinueFromLegal}
      />
    );
  }

  if (currentStep === "basic-info") {
    return (
      <MobileAppBasicInfo
        onBack={() => setCurrentStep("legal")}
        onContinue={handleContinueFromBasicInfo}
      />
    );
  }

  if (currentStep === "notifications") {
    return (
      <MobileAppNotifications
        onBack={() => setCurrentStep("basic-info")}
        onContinue={handleContinueFromNotifications}
      />
    );
  }

  if (currentStep === "photos") {
    return (
      <MobileAppPhotos
        onBack={() => setCurrentStep("notifications")}
        onContinue={handleContinueFromPhotos}
      />
    );
  }

  if (currentStep === "verification") {
    return (
      <MobileAppVerification
        onBack={() => setCurrentStep("photos")}
        onFinish={handleContinueFromVerification}
      />
    );
  }

  if (currentStep === "icebreakers") {
    return (
      <MobileAppIcebreakers
        onBack={() => setCurrentStep("verification")}
        onContinue={handleContinueFromIcebreakers}
      />
    );
  }

  if (currentStep === "preferences") {
    return (
      <MobileAppPreferences
        onBack={() => setCurrentStep("icebreakers")}
        onContinue={handleContinueFromPreferences}
      />
    );
  }

  if (currentStep === "tutorial") {
    return (
      <MobileAppTutorial
        onBack={() => setCurrentStep("preferences")}
        onFinish={handleFinishTutorial}
      />
    );
  }

  if (currentStep === "feed") {
    return <MobileAppMainFeed />;
  }

  return (
    <MobileAppWelcome
      onGoogleLogin={handleStartAuth}
      onAppleLogin={handleStartAuth}
    />
  );
}
