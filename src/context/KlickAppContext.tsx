'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  calculateKlickCompatibility,
  type KlickUserProfile,
  type CompatibilityResult,
} from '@/lib/klick/compatibility-engine';
import { CURRENT_MOCK_USER, MOCK_CANDIDATE_PROFILES } from '@/lib/klick/mock-profiles';
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
  const [currentUser, setCurrentUser] = useState<KlickUserProfile>(CURRENT_MOCK_USER);
  const [userRole, setUserRole] = useState<UserGenderRole>('female'); // Por defecto femenino (Gratis)
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

  const [matches, setMatches] = useState<Array<{ profile: KlickUserProfile; compatibility: CompatibilityResult; matchedAt: string }>>([
    {
      profile: MOCK_CANDIDATE_PROFILES[0],
      compatibility: calculateKlickCompatibility(CURRENT_MOCK_USER, MOCK_CANDIDATE_PROFILES[0]),
      matchedAt: 'Hace 2 horas',
    },
    {
      profile: MOCK_CANDIDATE_PROFILES[1],
      compatibility: calculateKlickCompatibility(CURRENT_MOCK_USER, MOCK_CANDIDATE_PROFILES[1]),
      matchedAt: 'Ayer',
    }
  ]);

  const [chats, setChats] = useState<ChatThread[]>([
    {
      id: 'thread_01',
      candidate: MOCK_CANDIDATE_PROFILES[0],
      compatibility: calculateKlickCompatibility(CURRENT_MOCK_USER, MOCK_CANDIDATE_PROFILES[0]),
      lastMessageAt: '10:45 AM',
      messages: [
        {
          id: 'm1',
          senderId: MOCK_CANDIDATE_PROFILES[0].id,
          text: '¡Hola Camila! Vi que también serviste tu misión y disfrutas el senderismo en Utah. ¡Hicimos un Klick del 93%!',
          timestamp: '10:30 AM',
          isRead: true,
        },
        {
          id: 'm2',
          senderId: CURRENT_MOCK_USER.id,
          text: '¡Hola Samuel! Sí, me encantó ver que coincidimos en tantas metas y en el deseo de matrimonio en el templo.',
          timestamp: '10:45 AM',
          isRead: true,
        }
      ]
    }
  ]);

  const [safeDatePlans, setSafeDatePlans] = useState<SafeDatePlan[]>([
    {
      id: 'plan_01',
      matchId: 'thread_01',
      candidateName: 'Samuel Anderson',
      candidatePhoto: MOCK_CANDIDATE_PROFILES[0].photos[0],
      venueName: 'Sugar House Coffee (Salt Lake City)',
      venueAddress: '2011 S 1100 E, Salt Lake City, UT 84105',
      dateTime: 'Sábado, 4:00 PM',
      trustedContactName: 'María Morales (Hermana)',
      trustedContactPhone: '+1 (801) 555-0199',
      status: 'scheduled',
      notes: 'Lugar público diurno y check-in activo.',
    }
  ]);

  // Calcular candidatos con algoritmo y aplicar filtros
  const candidatesWithScore = MOCK_CANDIDATE_PROFILES
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
        matchedAt: 'Ahora mismo',
      };
      setMatches(prev => [newMatch, ...prev]);

      // Si no existe hilo de chat, crearlo
      if (!chats.some(c => c.candidate.id === candidateId)) {
        const newThread: ChatThread = {
          id: `thread_${candidateId}_${Date.now()}`,
          candidate: item.profile,
          compatibility: item.compatibility,
          lastMessageAt: 'Ahora',
          messages: [
            {
              id: `sys_${Date.now()}`,
              senderId: 'system',
              text: `✨ ¡Felicidades! Han hecho Klick con un ${item.compatibility.score}% de compatibilidad. Tienen ${item.compatibility.commonGround.length} puntos de encuentro comunes.`,
              timestamp: 'Ahora',
              isRead: true,
            }
          ]
        };
        setChats(prev => [newThread, ...prev]);
      }

      toast.success(`💘 ¡Hicieron Klick! Compatibilidad del ${item.compatibility.score}%`);
      return { isMatch: true, compatibility: item.compatibility };
    } else {
      toast.info('Perfil registrado en tus likes.');
      return { isMatch: false };
    }
  };

  const passProfile = (candidateId: string) => {
    // Pasar al siguiente candidato
  };

  const sendMessage = (threadId: string, text: string) => {
    if (!canInitiateChat()) {
      toast.error('La suscripción Premium es requerida para enviar mensajes.');
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
          lastMessageAt: 'Ahora',
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
    toast.success('🛡️ ¡Plan Safe First Date creado con éxito!');
  };

  const checkInSafeDate = (planId: string) => {
    setSafeDatePlans(prev => prev.map(p => {
      if (p.id === planId) {
        toast.success('✅ Check-in confirmado: Llegaste a salvo a tu cita.');
        return { ...p, status: 'checked_in' as const };
      }
      return p;
    }));
  };

  const blockUser = (userId: string, reason: string) => {
    setBlockedUserIds(prev => [...prev, userId]);
    setMatches(prev => prev.filter(m => m.profile.id !== userId));
    setChats(prev => prev.filter(c => c.candidate.id !== userId));
    toast.success('Usuario bloqueado inmediatamente. No volverá a aparecer en tus resultados.');
  };

  const reportUser = (userId: string, category: string, details: string) => {
    blockUser(userId, `Reportado: ${category}`);
    toast.success(`🛡️ Reporte generado y enviado al equipo de Trust & Safety para auditoría.`);
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
