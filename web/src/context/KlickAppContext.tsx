'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  calculateKlickCompatibility,
  type KlickUserProfile,
  type CompatibilityResult,
} from '@/lib/klick/compatibility-engine';
import {
  CURRENT_MOCK_USER,
  CURRENT_MALE_MOCK_USER,
  MOCK_CANDIDATE_PROFILES,
  MOCK_FEMALE_CANDIDATE_PROFILES,
} from '@/lib/klick/mock-profiles';
import { toast } from 'sonner';

export type UserGenderRole = 'female' | 'male_free' | 'male_premium';

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatThread {
  id: string;
  candidate: KlickUserProfile;
  compatibility: CompatibilityResult;
  messages: ChatMessage[];
  lastMessageAt: string;
}

export interface SafeDatePlan {
  id: string;
  matchId: string;
  candidateName: string;
  candidatePhoto: string;
  venueName: string;
  venueAddress: string;
  dateTime: string;
  trustedContactName?: string;
  trustedContactPhone?: string;
  status: 'scheduled' | 'checked_in' | 'completed' | 'cancelled';
  notes?: string;
}

interface FilterState {
  minAge: number;
  maxAge: number;
  maxDistance: number;
  faithRequired: string;
  mustHaveTempleRecommend: boolean;
  mustWantMarriage: boolean;
  templeRequirementIndispensable: boolean;
}

interface KlickAppContextType {
  currentUser: KlickUserProfile;
  userRole: UserGenderRole;
  setUserRole: (role: UserGenderRole) => void;
  candidatesWithScore: Array<{ profile: KlickUserProfile; compatibility: CompatibilityResult }>;
  activeFilters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  matches: Array<{ profile: KlickUserProfile; compatibility: CompatibilityResult; matchedAt: string }>;
  chats: ChatThread[];
  safeDatePlans: SafeDatePlan[];
  likeProfile: (candidateId: string) => { isMatch: boolean; compatibility?: CompatibilityResult };
  passProfile: (candidateId: string) => void;
  sendMessage: (threadId: string, text: string) => void;
  createSafeDatePlan: (plan: Omit<SafeDatePlan, 'id' | 'status'>) => void;
  checkInSafeDate: (planId: string) => void;
  blockUser: (userId: string, reason: string) => void;
  reportUser: (userId: string, category: string, details: string) => void;
  canInitiateChat: () => boolean;
}

const KlickAppContext = createContext<KlickAppContextType | undefined>(undefined);

export function KlickAppProvider({ children }: { children: React.ReactNode }) {
  const { user, profile, entitlement } = useAuth();
  const [userRole, setUserRoleState] = useState<UserGenderRole>('female'); // Por defecto femenino (Gratis)

  // Con sesión y perfil guardado, el "molde" (hombre/mujer) lo decide el perfil real y su plan.
  useEffect(() => {
    if (!profile?.onboarded) return;
    if (profile.gender === 'female') setUserRoleState('female');
    else setUserRoleState(entitlement?.canChat ? 'male_premium' : 'male_free');
  }, [profile?.onboarded, profile?.gender, entitlement?.canChat]);

  const isMaleMode = userRole !== 'female';
  const mockUser = isMaleMode ? CURRENT_MALE_MOCK_USER : CURRENT_MOCK_USER;
  // Los campos del cuestionario siguen saliendo del molde hasta conectar `users/{uid}/restricted/details`.
  const currentUser = useMemo<KlickUserProfile>(
    () =>
      user && profile?.onboarded
        ? {
            ...mockUser,
            id: user.uid,
            name: profile.name,
            age: profile.age,
            gender: profile.gender,
            city: profile.city,
            state: profile.state,
            photos: profile.photos,
            bio: profile.bio,
            verifiedKYC: profile.verified,
          }
        : mockUser,
    [user, profile, mockUser],
  );
  const activeCandidatePool = isMaleMode ? MOCK_FEMALE_CANDIDATE_PROFILES : MOCK_CANDIDATE_PROFILES;

  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  
  const [activeFilters, setFilters] = useState<FilterState>({
    minAge: 21,
    maxAge: 35,
    maxDistance: 50,
    faithRequired: 'LDS',
    mustHaveTempleRecommend: true,
    mustWantMarriage: true,
    templeRequirementIndispensable: true,
  });

  const [femaleMatches, setFemaleMatches] = useState<Array<{ profile: KlickUserProfile; compatibility: CompatibilityResult; matchedAt: string }>>([
    {
      profile: MOCK_CANDIDATE_PROFILES[0],
      compatibility: calculateKlickCompatibility(CURRENT_MOCK_USER, MOCK_CANDIDATE_PROFILES[0]),
      matchedAt: '2 hours ago',
    },
    {
      profile: MOCK_CANDIDATE_PROFILES[1],
      compatibility: calculateKlickCompatibility(CURRENT_MOCK_USER, MOCK_CANDIDATE_PROFILES[1]),
      matchedAt: 'Yesterday',
    }
  ]);

  const [maleMatches, setMaleMatches] = useState<Array<{ profile: KlickUserProfile; compatibility: CompatibilityResult; matchedAt: string }>>([
    {
      profile: MOCK_FEMALE_CANDIDATE_PROFILES[0],
      compatibility: calculateKlickCompatibility(CURRENT_MALE_MOCK_USER, MOCK_FEMALE_CANDIDATE_PROFILES[0]),
      matchedAt: '1 hour ago',
    },
    {
      profile: MOCK_FEMALE_CANDIDATE_PROFILES[1],
      compatibility: calculateKlickCompatibility(CURRENT_MALE_MOCK_USER, MOCK_FEMALE_CANDIDATE_PROFILES[1]),
      matchedAt: 'Yesterday',
    }
  ]);

  const [femaleChats, setFemaleChats] = useState<ChatThread[]>([
    {
      id: 'thread_01',
      candidate: MOCK_CANDIDATE_PROFILES[0],
      compatibility: calculateKlickCompatibility(CURRENT_MOCK_USER, MOCK_CANDIDATE_PROFILES[0]),
      lastMessageAt: '10:45 AM',
      messages: [
        {
          id: 'm1',
          senderId: MOCK_CANDIDATE_PROFILES[0].id,
          text: 'Hey Camila! Saw you served a mission and love hiking around Utah. We got a 93% Klick compatibility!',
          timestamp: '10:30 AM',
          isRead: true,
        },
        {
          id: 'm2',
          senderId: CURRENT_MOCK_USER.id,
          text: 'Hi Samuel! Yes, loved seeing we share so many values and goals towards temple marriage.',
          timestamp: '10:45 AM',
          isRead: true,
        }
      ]
    }
  ]);

  const [maleChats, setMaleChats] = useState<ChatThread[]>([
    {
      id: 'thread_male_01',
      candidate: MOCK_FEMALE_CANDIDATE_PROFILES[0],
      compatibility: calculateKlickCompatibility(CURRENT_MALE_MOCK_USER, MOCK_FEMALE_CANDIDATE_PROFILES[0]),
      lastMessageAt: '12:32 PM',
      messages: [
        {
          id: 'mm1',
          senderId: MOCK_FEMALE_CANDIDATE_PROFILES[0].id,
          text: 'Hi Juan Carlos! Saw you also served an international mission and love music ✨',
          timestamp: '12:30 PM',
          isRead: true,
        },
        {
          id: 'mm2',
          senderId: CURRENT_MALE_MOCK_USER.id,
          text: 'Hi Camila! Yes, it was an unforgettable experience. How is your week going?',
          timestamp: '12:32 PM',
          isRead: true,
        }
      ]
    }
  ]);

  const [femaleSafeDatePlans, setFemaleSafeDatePlans] = useState<SafeDatePlan[]>([
    {
      id: 'plan_01',
      matchId: 'thread_01',
      candidateName: 'Samuel Anderson',
      candidatePhoto: MOCK_CANDIDATE_PROFILES[0].photos[0],
      venueName: 'Sugar House Coffee (Salt Lake City)',
      venueAddress: '2011 S 1100 E, Salt Lake City, UT 84105',
      dateTime: 'Saturday, 4:00 PM',
      trustedContactName: 'Maria Morales (Sister)',
      trustedContactPhone: '+1 (801) 555-0199',
      status: 'scheduled',
      notes: 'Daytime public venue with active safety check-in.',
    }
  ]);

  const [maleSafeDatePlans, setMaleSafeDatePlans] = useState<SafeDatePlan[]>([
    {
      id: 'plan_male_01',
      matchId: 'thread_male_01',
      candidateName: 'Camila Valencia',
      candidatePhoto: MOCK_FEMALE_CANDIDATE_PROFILES[0].photos[0],
      venueName: 'The Shops at Riverwoods (Provo)',
      venueAddress: '4801 N University Ave, Provo, UT 84604',
      dateTime: 'Saturday, 5:00 PM',
      trustedContactName: 'Carlos Morales (Brother)',
      trustedContactPhone: '+1 (801) 555-0144',
      status: 'scheduled',
      notes: 'Verified safe public meetup validated by Klick Safe Date protocol.',
    }
  ]);

  const matches = isMaleMode ? maleMatches : femaleMatches;
  const setMatches = isMaleMode ? setMaleMatches : setFemaleMatches;
  const chats = isMaleMode ? maleChats : femaleChats;
  const setChats = isMaleMode ? setMaleChats : setFemaleChats;
  const safeDatePlans = isMaleMode ? maleSafeDatePlans : femaleSafeDatePlans;
  const setSafeDatePlans = isMaleMode ? setMaleSafeDatePlans : setFemaleSafeDatePlans;
  const setUserRole = setUserRoleState;

  // Calcular candidatos con algoritmo y aplicar filtros
  const candidatesWithScore = activeCandidatePool
    .filter(c => !blockedUserIds.includes(c.id))
    .filter(c => c.age >= activeFilters.minAge && c.age <= activeFilters.maxAge)
    .filter(c => c.distanceMiles <= activeFilters.maxDistance)
    .map(c => {
      const userProfileForCalc = {
        ...currentUser,
        templeMarriageRequirement: activeFilters.templeRequirementIndispensable ? ('Indispensable' as const) : ('Preferred' as const),
      };
      const compatibility = calculateKlickCompatibility(userProfileForCalc, c);
      return { profile: c, compatibility };
    })
    .filter(item => item.compatibility.passedHardCompatibilityGate);

  const canInitiateChat = () => {
    // Mujeres: 100% gratis
    if (userRole === 'female') return true;
    // Hombres Premium: Sí
    if (userRole === 'male_premium') return true;
    // Hombres Free: Requiere upgrade
    return false;
  };

  const likeProfile = (candidateId: string) => {
    const item = candidatesWithScore.find(c => c.profile.id === candidateId);
    if (!item) return { isMatch: false };

    if (item.compatibility.isEligibleForMatch) {
      const newMatch = {
        profile: item.profile,
        compatibility: item.compatibility,
        matchedAt: 'Just now',
      };
      setMatches(prev => [newMatch, ...prev]);

      // Si no existe hilo de chat, crearlo
      if (!chats.some(c => c.candidate.id === candidateId)) {
        const newThread: ChatThread = {
          id: `thread_${candidateId}_${Date.now()}`,
          candidate: item.profile,
          compatibility: item.compatibility,
          lastMessageAt: 'Now',
          messages: [
            {
              id: `sys_${Date.now()}`,
              senderId: 'system',
              text: `✨ Congratulations! You made a Klick with ${item.compatibility.score}% compatibility and ${item.compatibility.commonGround.length} shared common ground points.`,
              timestamp: 'Now',
              isRead: true,
            }
          ]
        };
        setChats(prev => [newThread, ...prev]);
      }

      toast.success(`💘 It's a Klick! ${item.compatibility.score}% compatibility`);
      return { isMatch: true, compatibility: item.compatibility };
    } else {
      toast.info('Profile saved to your liked candidates.');
      return { isMatch: false };
    }
  };

  const passProfile = (candidateId: string) => {
    // Next candidate
  };

  const sendMessage = (threadId: string, text: string) => {
    if (!canInitiateChat()) {
      toast.error('VIP Subscription required to send messages.');
      return;
    }

    setChats(prev => prev.map(thread => {
      if (thread.id === threadId) {
        const newMsg: ChatMessage = {
          id: `msg_${Date.now()}`,
          senderId: currentUser.id,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: true,
        };
        return {
          ...thread,
          lastMessageAt: 'Now',
          messages: [...thread.messages, newMsg]
        };
      }
      return thread;
    }));
  };

  const createSafeDatePlan = (plan: Omit<SafeDatePlan, 'id' | 'status'>) => {
    const newPlan: SafeDatePlan = {
      ...plan,
      id: `plan_${Date.now()}`,
      status: 'scheduled',
    };
    setSafeDatePlans(prev => [newPlan, ...prev]);
    toast.success('🛡️ Safe First Date plan created successfully!');
  };

  const checkInSafeDate = (planId: string) => {
    setSafeDatePlans(prev => prev.map(p => {
      if (p.id === planId) {
        toast.success('✅ Check-in confirmed: You arrived safely.');
        return { ...p, status: 'checked_in' as const };
      }
      return p;
    }));
  };

  const blockUser = (userId: string, reason: string) => {
    setBlockedUserIds(prev => [...prev, userId]);
    setMatches(prev => prev.filter(m => m.profile.id !== userId));
    setChats(prev => prev.filter(c => c.candidate.id !== userId));
    toast.success('User blocked immediately. They will no longer appear in your feed.');
  };

  const reportUser = (userId: string, category: string, details: string) => {
    blockUser(userId, `Reported: ${category}`);
    toast.success(`🛡️ Safety report submitted and forwarded to Trust & Safety.`);
  };

  return (
    <KlickAppContext.Provider
      value={{
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
      }}
    >
      {children}
    </KlickAppContext.Provider>
  );
}

export function useKlickApp() {
  const context = useContext(KlickAppContext);
  if (!context) {
    throw new Error('useKlickApp debe utilizarse dentro de un KlickAppProvider');
  }
  return context;
}
