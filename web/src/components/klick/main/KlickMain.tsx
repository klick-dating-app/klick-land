"use client";

import React, { useState, useEffect } from "react";
import { useKlickApp, type ChatThread } from "@/context/KlickAppContext";
import {
  UTAH_SAFE_FIRST_DATE_VENUES,
  type UtahSafeVenue,
} from "@/lib/klick/mock-profiles";
import { toast } from "sonner";
import {
  LightThemeStyles,
  type DateReviewItem,
  type PersonalFeedbackItem,
} from "@/components/klick/main/badges";
import FeedTabSection from "@/components/klick/main/sections/FeedTabSection";
import KlicksTabSection from "@/components/klick/main/sections/KlicksTabSection";
import InboxTabSection from "@/components/klick/main/sections/InboxTabSection";
import SafeDatesTabSection from "@/components/klick/main/sections/SafeDatesTabSection";
import ProfileTabSection from "@/components/klick/main/sections/ProfileTabSection";
import BottomNavBar, {
  type KlickTab,
} from "@/components/klick/main/sections/BottomNavBar";
import ProfileModals from "@/components/klick/main/modals/ProfileModals";
import DiscoveryModals from "@/components/klick/main/modals/DiscoveryModals";
import { WebSidebar, WebContextPanel } from "@/components/klick/main/WebShell";

interface KlickMainProps {
  initialGender?: "male" | "female";
  /** `app`: marco móvil con barra inferior. `web`: menú lateral + columna central + panel de contexto. */
  layout?: "app" | "web";
}

export default function KlickMain({
  initialGender,
  layout = "app",
}: KlickMainProps = {}) {
  const {
    currentUser,
    userRole,
    setUserRole,
    candidatesWithScore,
    activeFilters,
    setFilters,
    matches,
    chats,
    safeDatePlans,
    likeProfile,
    passProfile,
    sendMessage,
    createSafeDatePlan,
    checkInSafeDate,
    blockUser,
    reportUser,
    canInitiateChat,
  } = useKlickApp();

  useEffect(() => {
    if (initialGender === "male") {
      setUserRole("male_premium");
    } else if (initialGender === "female") {
      setUserRole("female");
    }
  }, [initialGender, setUserRole]);

  const [profileIndex, setProfileIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<KlickTab>("feed");

  const [matchAnimation, setMatchAnimation] = useState(false);
  const [dateAnimation, setDateAnimation] = useState(false);

  // Modales
  const [showRadarModal, setShowRadarModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSafeDateModal, setShowSafeDateModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCandidateProfileModal, setShowCandidateProfileModal] =
    useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showEditFeedModal, setShowEditFeedModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  // Chat activo (null muestra la bandeja Inbox editorial primero)
  const [activeChatThread, setActiveChatThread] = useState<ChatThread | null>(
    null
  );
  const [typedMessage, setTypedMessage] = useState("");

  // Formulario Safe Date
  const [selectedVenue, setSelectedVenue] = useState<UtahSafeVenue>(
    UTAH_SAFE_FIRST_DATE_VENUES[0]
  );
  const [dateCandidateId, setDateCandidateId] = useState<string>("");
  const [datePreselected, setDatePreselected] = useState<boolean>(false);
  const [dateTimeText, setDateTimeText] = useState("Saturday, 5:00 PM");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");

  // Estado editable de mi perfil y fotos
  const [editName, setEditName] = useState(currentUser.name);
  const [editAge, setEditAge] = useState(currentUser.age);
  const [editCity, setEditCity] = useState(currentUser.city);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editOccupation, setEditOccupation] = useState(currentUser.occupation);
  const [editTemple, setEditTemple] = useState(currentUser.templeRecommend);
  const [editMission, setEditMission] = useState(currentUser.servedMission);
  const [editTimeline, setEditTimeline] = useState(
    currentUser.marriageTimeline
  );
  const [userPhotos, setUserPhotos] = useState<string[]>(currentUser.photos);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  // Estado editable de Date Place (Lugar, Vestimenta y Detalles)
  const [showDatePlaceModal, setShowDatePlaceModal] = useState(false);
  const [datePlaceVenue, setDatePlaceVenue] = useState("Sugar House Coffee");
  const [datePlaceAddress, setDatePlaceAddress] = useState(
    "2011 S 1100 E, Salt Lake City, UT"
  );
  const [datePlaceOutfitStyle, setDatePlaceOutfitStyle] =
    useState("Smart Casual");
  const [datePlaceOutfitDesc, setDatePlaceOutfitDesc] = useState(
    "Navy jacket, white shirt & jeans"
  );
  const [datePlaceVibe, setDatePlaceVibe] = useState("Coffee & Conversation");
  const [datePlaceNotes, setDatePlaceNotes] = useState(
    "Meet by the main entrance patio, 15 min early"
  );

  // Estado compartido de Reviews (Públicos en el Feed) y Feedbacks (Privados en Profile)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [dateReviews, setDateReviews] = useState<DateReviewItem[]>([
    {
      id: "rev-init-1",
      author: "Verified Klick Date",
      partnerName: "Camila Valencia",
      venue: "The Shops at Riverwoods (Provo)",
      rating: 5,
      highlights: ["Respectful & kind", "Great conversation", "Punctual"],
      comment:
        "Genuine, super easy to talk with, and made the whole coffee date feel effortless and fun.",
      date: "Recent Safe Date",
    },
    {
      id: "rev-init-2",
      author: "Verified Klick Date",
      partnerName: "Camila Valencia",
      venue: "Sugar House Coffee (Salt Lake City)",
      rating: 5,
      highlights: ["Safe & welcoming venue", "Great chemistry"],
      comment:
        "Really thoughtful conversation and shared values from the very first minute.",
      date: "Verified Meetup",
    },
  ]);

  const [personalFeedbacks, setPersonalFeedbacks] = useState<
    PersonalFeedbackItem[]
  >([
    {
      id: "fb-init-1",
      topic: "Venue seating & noise",
      improvement:
        "Choosing a quieter table inside the café helps make conversation easier during busy hours.",
      date: "Private Note",
    },
    {
      id: "fb-init-2",
      topic: "Date timing / schedule",
      improvement:
        "Arriving 5–10 minutes early makes parking and meeting at the entrance much smoother.",
      date: "Private Note",
    },
  ]);

  const safeUserPhotos =
    Array.isArray(userPhotos) &&
    userPhotos.length > 0 &&
    typeof userPhotos[0] === "string" &&
    (userPhotos[0].startsWith("http") ||
      userPhotos[0].startsWith("/") ||
      userPhotos[0].startsWith("blob:"))
      ? userPhotos
      : currentUser.photos;

  useEffect(() => {
    setEditName(currentUser.name);
    setEditAge(currentUser.age);
    setEditCity(currentUser.city);
    setEditBio(currentUser.bio);
    setEditOccupation(currentUser.occupation);
    setEditTemple(currentUser.templeRecommend);
    setEditMission(currentUser.servedMission);
    setEditTimeline(currentUser.marriageTimeline);
    setUserPhotos(currentUser.photos);
    setActiveChatThread(null);
    setProfileIndex(0);
    setPhotoIndex(0);
  }, [currentUser.id, currentUser.name]);

  const activeCandidates = candidatesWithScore;
  const currentCandidateEntry =
    activeCandidates.length > 0
      ? activeCandidates[profileIndex % activeCandidates.length]
      : null;
  const currentCandidate = currentCandidateEntry?.profile;
  const currentCompatibility = currentCandidateEntry?.compatibility;

  const feedScrollRef = React.useRef<HTMLDivElement>(null);

  const handlePass = () => {
    if (!currentCandidate) return;
    passProfile(currentCandidate.id);
    setProfileIndex((prev) => prev + 1);
    setPhotoIndex(0);
    feedScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLike = () => {
    if (!currentCandidate) return;
    const res = likeProfile(currentCandidate.id);
    if (res.isMatch) {
      setMatchAnimation(true);
      setTimeout(() => {
        setMatchAnimation(false);
        setProfileIndex((prev) => prev + 1);
        setPhotoIndex(0);
        feedScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }, 1500);
    } else {
      setProfileIndex((prev) => prev + 1);
      setPhotoIndex(0);
      feedScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePlanDateWithCandidate = (candidateId: string) => {
    setDateCandidateId(candidateId);
    setDatePreselected(true);
    setShowSafeDateModal(true);
  };

  const handleDateRequest = () => {
    if (!currentCandidate) return;
    handlePlanDateWithCandidate(currentCandidate.id);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeChatThread) return;

    if (!canInitiateChat()) {
      setShowUpgradeModal(true);
      return;
    }

    sendMessage(activeChatThread.id, typedMessage);
    setTypedMessage("");
  };

  const handleSaveSafeDate = (e: React.FormEvent) => {
    e.preventDefault();
    const target =
      matches.find((m) => m.profile.id === dateCandidateId)?.profile ||
      activeCandidates.find((c) => c.profile.id === dateCandidateId)?.profile ||
      activeChatThread?.candidate ||
      matches[0]?.profile ||
      currentCandidate;

    if (!target) return;

    createSafeDatePlan({
      matchId: target.id,
      candidateName: target.name,
      candidatePhoto: target.photos[0],
      venueName: selectedVenue.name,
      venueAddress: selectedVenue.address,
      dateTime: dateTimeText,
      trustedContactName: guardianName || "Trusted Family Contact",
      trustedContactPhone: guardianPhone || "+1 (801) 555-0199",
      notes:
        "Verified safe public meetup validated by Klick Safe Date protocol.",
    });

    setShowSafeDateModal(false);
    toast.success("Safe Date scheduled successfully!");
    setActiveTab("citas");
  };

  const handleBlockCurrentCandidate = () => {
    if (!currentCandidate) return;
    blockUser(currentCandidate.id, "Blocked by user");
    setShowReportModal(false);
    setShowCandidateProfileModal(false);
    toast.success("User blocked and excluded from your recommendations.");
    handlePass();
  };

  const handleReportCurrentCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCandidate) return;
    reportUser(
      currentCandidate.id,
      "Safety report",
      reportReason || "Community guidelines violation"
    );
    setShowReportModal(false);
    setShowCandidateProfileModal(false);
    toast.success("Report submitted to Klick Trust & Safety.");
    handlePass();
  };

  const isWeb = layout === "web";
  const themeClasses = isLightMode
    ? "klick-light-theme bg-white text-zinc-900 md:border-zinc-200"
    : "bg-[#070709] text-white md:border-zinc-800/80";

  const bottomNav = (
    <BottomNavBar
      activeTab={activeTab}
      showFilterModal={showFilterModal}
      matchesCount={matches.length}
      chatsCount={chats.length}
      onSelectTab={setActiveTab}
      onOpenFilters={() => setShowFilterModal(true)}
    />
  );

  const screen = (
    <>
        {isLightMode && <LightThemeStyles />}

        {/* 1. SECCIÓN FEED */}
        {activeTab === "feed" && currentCandidate && currentCompatibility && (
          <FeedTabSection
            feedScrollRef={feedScrollRef}
            currentCandidate={currentCandidate}
            currentCompatibility={currentCompatibility}
            isLightMode={isLightMode}
            matchAnimation={matchAnimation}
            dateReviews={dateReviews}
            onOpenReport={() => setShowReportModal(true)}
            onOpenRadar={() => setShowRadarModal(true)}
            onPass={handlePass}
            onLike={handleLike}
            onDateRequest={handleDateRequest}
          />
        )}

        {/* 2. SECCIÓN KLICKS */}
        {activeTab === "klicks" && (
          <KlicksTabSection
            matches={matches}
            chats={chats}
            safeDatePlans={safeDatePlans}
            onGoToFeed={() => setActiveTab("feed")}
            onOpenChatFromMatch={(thread) => {
              if (thread) setActiveChatThread(thread);
              setActiveTab("inbox");
            }}
            onGoToDates={() => setActiveTab("citas")}
            onPlanDateWithCandidate={handlePlanDateWithCandidate}
          />
        )}

        {/* 3. SECCIÓN INBOX & CHAT */}
        {activeTab === "inbox" && (
          <InboxTabSection
            currentUserId={currentUser.id}
            matches={matches}
            chats={chats}
            activeChatThread={activeChatThread}
            typedMessage={typedMessage}
            canInitiateChat={canInitiateChat()}
            onSelectChatThread={setActiveChatThread}
            onChangeTypedMessage={setTypedMessage}
            onSendMessage={handleSendMessage}
            onPlanDateWithCandidate={handlePlanDateWithCandidate}
            onOpenReport={() => setShowReportModal(true)}
            onOpenUpgrade={() => setShowUpgradeModal(true)}
          />
        )}

        {/* 4. SECCIÓN SAFE DATES */}
        {activeTab === "citas" && (
          <SafeDatesTabSection
            safeDatePlans={safeDatePlans}
            matches={matches}
            dateReviews={dateReviews}
            onAddReview={(rev) => setDateReviews((prev) => [rev, ...prev])}
            onAddFeedback={(fb) =>
              setPersonalFeedbacks((prev) => [fb, ...prev])
            }
            onOpenNewSafeDate={() => {
              setDatePreselected(false);
              setDateCandidateId(
                matches[0]?.profile.id || activeCandidates[0]?.profile.id || ""
              );
              setShowSafeDateModal(true);
            }}
            onPlanDateWithCandidate={handlePlanDateWithCandidate}
            onCheckInSafeDate={checkInSafeDate}
          />
        )}

        {/* 5. SECCIÓN PERFIL */}
        {activeTab === "perfil" && (
          <ProfileTabSection
            isLightMode={isLightMode}
            onToggleLightMode={() => setIsLightMode((prev) => !prev)}
            safeUserPhotos={safeUserPhotos}
            editName={editName}
            editAge={editAge}
            editCity={editCity}
            userState={currentUser.state}
            editOccupation={editOccupation}
            editBio={editBio}
            onChangeBio={setEditBio}
            isEditingBio={isEditingBio}
            onChangeIsEditingBio={setIsEditingBio}
            editTemple={editTemple}
            editTimeline={editTimeline}
            userRole={userRole}
            datePlaceVenue={datePlaceVenue}
            datePlaceOutfitStyle={datePlaceOutfitStyle}
            feedbackCount={personalFeedbacks.length}
            onOpenEditProfile={() => setShowEditProfileModal(true)}
            onOpenEditFeed={() => setShowEditFeedModal(true)}
            onOpenUpgrade={() => setShowUpgradeModal(true)}
            onOpenDatePlace={() => setShowDatePlaceModal(true)}
            onOpenFeedback={() => setShowFeedbackModal(true)}
          />
        )}

        {/* BARRA DE NAVEGACIÓN INFERIOR (en web solo bajo lg, donde no hay menú lateral) */}
        {isWeb ? <div className="lg:hidden">{bottomNav}</div> : bottomNav}

        {/* MODALES DE PERFIL (Edit Profile, Edit Feed, Subscriptions, Date Place, Personal Feedback) */}
        <ProfileModals
          isLightMode={isLightMode}
          userState={currentUser.state}
          userRole={userRole}
          setUserRole={setUserRole}
          showEditProfileModal={showEditProfileModal}
          onCloseEditProfile={() => setShowEditProfileModal(false)}
          editName={editName}
          setEditName={setEditName}
          editAge={editAge}
          setEditAge={setEditAge}
          editCity={editCity}
          setEditCity={setEditCity}
          editOccupation={editOccupation}
          setEditOccupation={setEditOccupation}
          editBio={editBio}
          setEditBio={setEditBio}
          editTemple={editTemple}
          setEditTemple={setEditTemple}
          editMission={editMission}
          setEditMission={setEditMission}
          editTimeline={editTimeline}
          setEditTimeline={setEditTimeline}
          showEditFeedModal={showEditFeedModal}
          onCloseEditFeed={() => setShowEditFeedModal(false)}
          safeUserPhotos={safeUserPhotos}
          setUserPhotos={setUserPhotos}
          showUpgradeModal={showUpgradeModal}
          onCloseUpgrade={() => setShowUpgradeModal(false)}
          showDatePlaceModal={showDatePlaceModal}
          onCloseDatePlace={() => setShowDatePlaceModal(false)}
          datePlaceVenue={datePlaceVenue}
          setDatePlaceVenue={setDatePlaceVenue}
          datePlaceAddress={datePlaceAddress}
          setDatePlaceAddress={setDatePlaceAddress}
          datePlaceOutfitStyle={datePlaceOutfitStyle}
          setDatePlaceOutfitStyle={setDatePlaceOutfitStyle}
          datePlaceOutfitDesc={datePlaceOutfitDesc}
          setDatePlaceOutfitDesc={setDatePlaceOutfitDesc}
          datePlaceVibe={datePlaceVibe}
          setDatePlaceVibe={setDatePlaceVibe}
          datePlaceNotes={datePlaceNotes}
          setDatePlaceNotes={setDatePlaceNotes}
          showFeedbackModal={showFeedbackModal}
          onCloseFeedback={() => setShowFeedbackModal(false)}
          personalFeedbacks={personalFeedbacks}
        />

        {/* MODALES DE DESCUBRIMIENTO Y SEGURIDAD (Filters, Radar, Safe Date, Report) */}
        <DiscoveryModals
          showReportModal={showReportModal}
          onCloseReport={() => setShowReportModal(false)}
          reportReason={reportReason}
          setReportReason={setReportReason}
          onBlockCurrentCandidate={handleBlockCurrentCandidate}
          onReportCurrentCandidate={handleReportCurrentCandidate}
          showRadarModal={showRadarModal}
          onCloseRadar={() => setShowRadarModal(false)}
          currentCompatibility={currentCompatibility}
          showSafeDateModal={showSafeDateModal}
          onCloseSafeDate={() => setShowSafeDateModal(false)}
          onSaveSafeDate={handleSaveSafeDate}
          matches={matches}
          activeCandidates={activeCandidates}
          dateCandidateId={dateCandidateId}
          setDateCandidateId={setDateCandidateId}
          datePreselected={datePreselected}
          setDatePreselected={setDatePreselected}
          selectedVenue={selectedVenue}
          setSelectedVenue={setSelectedVenue}
          dateTimeText={dateTimeText}
          setDateTimeText={setDateTimeText}
          guardianName={guardianName}
          setGuardianName={setGuardianName}
          guardianPhone={guardianPhone}
          setGuardianPhone={setGuardianPhone}
          showFilterModal={showFilterModal}
          onCloseFilters={() => setShowFilterModal(false)}
          activeFilters={activeFilters}
          setFilters={setFilters}
        />
    </>
  );

  if (isWeb) {
    const upNext =
      activeCandidates.length > 1
        ? [1, 2, 3]
            .map((offset) => activeCandidates[(profileIndex + offset) % activeCandidates.length])
            .filter((c, i, arr) => c.profile.id !== currentCandidate?.id && arr.findIndex((x) => x.profile.id === c.profile.id) === i)
        : [];

    return (
      <div className="h-[100dvh] w-full bg-black text-white flex overflow-hidden select-none">
        <WebSidebar
          activeTab={activeTab}
          showFilterModal={showFilterModal}
          matchesCount={matches.length}
          chatsCount={chats.length}
          userRole={userRole}
          currentUser={currentUser}
          onSelectTab={setActiveTab}
          onOpenFilters={() => setShowFilterModal(true)}
          onSwitchRole={setUserRole}
        />
        {/* Las secciones están diseñadas para ~500px; en pantalla grande se centran y el espacio lateral lo usan menú y panel. */}
        <main className="flex-1 min-w-0 flex justify-center bg-[#050507]">
          <div
            className={`w-full max-w-[540px] h-full flex flex-col justify-between relative overflow-hidden md:border-x transition-colors duration-300 ${themeClasses}`}
          >
            {screen}
          </div>
        </main>
        <WebContextPanel
          activeTab={activeTab}
          currentCandidate={currentCandidate}
          currentCompatibility={currentCompatibility}
          upNext={upNext}
          matches={matches}
          safeDatePlans={safeDatePlans}
          onSelectTab={setActiveTab}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Contenedor simulador móvil */}
      <div
        className={`w-full max-w-[430px] h-[100dvh] flex flex-col justify-between relative overflow-hidden shadow-2xl md:border md:rounded-[40px] transition-colors duration-300 ${themeClasses}`}
      >
        {screen}
      </div>
    </div>
  );
}
