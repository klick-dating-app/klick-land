'use client';

import React, { useState } from 'react';
import { useKlickApp, type ChatThread, type SafeDatePlan } from '@/context/KlickAppContext';
import { type KlickUserProfile } from '@/lib/klick/compatibility-engine';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  MapPin,
  Calendar,
  Lock,
  Filter,
  CheckCircle2,
  X,
  Send,
  User,
  Sliders,
  AlertTriangle,
  Flame,
  Star,
  ChevronRight,
  Info,
  Phone,
  Church,
  BookOpen,
  ArrowRight,
  Zap,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function KlickWebPortalPage() {
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
    sendMessage,
    createSafeDatePlan,
    checkInSafeDate,
    blockUser,
    reportUser,
    canInitiateChat,
  } = useKlickApp();

  const [activeTab, setActiveTab] = useState<'discover' | 'chats' | 'safedate' | 'profile' | 'membership'>('discover');
  const [selectedCandidate, setSelectedCandidate] = useState<KlickUserProfile | null>(null);
  const [activeChatThread, setActiveChatThread] = useState<ChatThread | null>(chats[0] || null);
  const [chatInputText, setChatInputText] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSafeDateModal, setShowSafeDateModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Formulario Safe First Date
  const [dateVenue, setDateVenue] = useState('Sugar House Coffee (Salt Lake City)');
  const [dateAddress, setDateAddress] = useState('2011 S 1100 E, Salt Lake City, UT 84105');
  const [dateTime, setDateTime] = useState('Sábado, 5:00 PM');
  const [trustedName, setTrustedName] = useState('');
  const [trustedPhone, setTrustedPhone] = useState('');

  const handleLike = (candidate: KlickUserProfile) => {
    const res = likeProfile(candidate.id);
    if (res.isMatch) {
      // Auto open chat tab if user wants
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim() || !activeChatThread) return;

    if (!canInitiateChat()) {
      setShowUpgradeModal(true);
      return;
    }

    sendMessage(activeChatThread.id, chatInputText);
    setChatInputText('');
  };

  const handleScheduleSafeDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate && !activeChatThread) return;
    const targetCandidate = selectedCandidate || activeChatThread?.candidate;
    if (!targetCandidate) return;

    createSafeDatePlan({
      matchId: targetCandidate.id,
      candidateName: targetCandidate.name,
      candidatePhoto: targetCandidate.photos[0],
      venueName: dateVenue,
      venueAddress: dateAddress,
      dateTime: dateTime,
      trustedContactName: trustedName || 'Contacto de Confianza',
      trustedContactPhone: trustedPhone || '+1 (801) 555-0100',
    });

    setShowSafeDateModal(false);
    setActiveTab('safedate');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* SIDEBAR NAVEGACIÓN DESKTOP */}
      <aside className="w-full md:w-72 bg-[#0d111a] border-r border-slate-800/80 p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-[#9b4dca] flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                KLICK! <span className="text-[10px] uppercase tracking-wider bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full font-bold">Utah LDS</span>
              </h1>
              <p className="text-xs text-slate-400">Plataforma de Relaciones Seguras</p>
            </div>
          </div>

          {/* User Status Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 mb-6">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.photos[0]}
                alt={currentUser.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-pink-500/40"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white truncate">{currentUser.name}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] px-2 py-0.2 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    KYC Verificado
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {userRole === 'female' ? 'Mujer (Gratis)' : userRole === 'male_premium' ? 'Hombre (VIP)' : 'Hombre (Free)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('discover')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'discover'
                  ? 'bg-gradient-to-r from-pink-600/90 to-[#9b4dca]/90 text-white shadow-lg shadow-pink-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>Descubrir & Klick Score</span>
            </button>

            <button
              onClick={() => setActiveTab('chats')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'chats'
                  ? 'bg-gradient-to-r from-pink-600/90 to-[#9b4dca]/90 text-white shadow-lg shadow-pink-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <MessageCircle className="w-5 h-5" />
                <span>Mensajes & Matches</span>
              </div>
              {chats.length > 0 && (
                <span className="text-xs bg-pink-500 text-white font-bold px-2 py-0.5 rounded-full">
                  {chats.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('safedate')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'safedate'
                  ? 'bg-gradient-to-r from-pink-600/90 to-[#9b4dca]/90 text-white shadow-lg shadow-pink-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Safe First Date</span>
              </div>
              {safeDatePlans.length > 0 && (
                <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full">
                  {safeDatePlans.length} activa
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-pink-600/90 to-[#9b4dca]/90 text-white shadow-lg shadow-pink-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Mi Perfil & Fe LDS</span>
            </button>

            <button
              onClick={() => setActiveTab('membership')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'membership'
                  ? 'bg-gradient-to-r from-pink-600/90 to-[#9b4dca]/90 text-white shadow-lg shadow-pink-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <CreditCard className="w-5 h-5 text-amber-400" />
              <span>Membresía & Pagos</span>
            </button>
          </nav>
        </div>

        {/* Footer Role Switcher (para probar roles de Fase 1) */}
        <div className="pt-6 border-t border-slate-800/80">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-2">Simular Rol de Usuario:</p>
          <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
            <button
              onClick={() => { setUserRole('female'); toast.success('Rol cambiado a: Mujer (100% Gratis)'); }}
              className={`py-1.5 rounded-lg font-medium transition-all ${userRole === 'female' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Mujer
            </button>
            <button
              onClick={() => { setUserRole('male_free'); toast.info('Rol cambiado a: Hombre (Gratis)'); }}
              className={`py-1.5 rounded-lg font-medium transition-all ${userRole === 'male_free' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Hombre Free
            </button>
            <button
              onClick={() => { setUserRole('male_premium'); toast.success('Rol cambiado a: Hombre (Premium)'); }}
              className={`py-1.5 rounded-lg font-medium transition-all ${userRole === 'male_premium' ? 'bg-[#9b4dca] text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Hombre VIP
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL SEGÚN TAB */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#07090e]">
        
        {/* TAB 1: DESCUBRIR & RADAR 0-100% */}
        {activeTab === 'discover' && (
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>Descubrir Conexiones</span>
                  <span className="text-pink-500 text-lg">✨</span>
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Candidatos ordenados por afinidad multidimensional en Fe LDS, valores y objetivos familiares.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowFilterModal(true)}
                  variant="outline"
                  className="bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 rounded-2xl flex items-center gap-2"
                >
                  <Filter className="w-4 h-4 text-pink-400" />
                  <span>Filtros Indispensables ({activeFilters.templeRequirementIndispensable ? 'Templo Activo' : 'Abierto'})</span>
                </Button>
              </div>
            </div>

            {/* Grid de Candidatos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidatesWithScore.map(({ profile, compatibility }) => {
                return (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0d111a] border border-slate-800/80 hover:border-pink-500/40 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 group"
                  >
                    <div>
                      {/* Foto y Badges */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                        <img
                          src={profile.photos[0]}
                          alt={profile.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d111a] via-transparent to-black/40" />

                        {/* Compatibility Badge (Score 0-100%) */}
                        <div className="absolute top-3.5 left-3.5">
                          <div className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-lg backdrop-blur-md ${
                            compatibility.score >= 85
                              ? 'bg-emerald-500/90 text-white'
                              : compatibility.score >= 70
                              ? 'bg-pink-600/90 text-white'
                              : 'bg-amber-500/90 text-slate-950'
                          }`}>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{compatibility.score}% Klick</span>
                          </div>
                        </div>

                        {/* KYC Shield Badge */}
                        <div className="absolute top-3.5 right-3.5">
                          {profile.verifiedKYC && (
                            <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> Verified
                            </div>
                          )}
                        </div>

                        {/* Nombre y Distancia */}
                        <div className="absolute bottom-3 left-4 right-4">
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            {profile.name}, {profile.age}
                          </h3>
                          <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-pink-400" />
                            {profile.city}, Utah ({profile.distanceMiles} millas)
                          </p>
                        </div>
                      </div>

                      {/* Info & Common Ground */}
                      <div className="p-5">
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                          {profile.bio}
                        </p>

                        {/* Puntos de Fe & Templo */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-pink-300 flex items-center gap-1">
                            <Church className="w-3 h-3" /> {profile.faith} ({profile.faithImportance})
                          </span>
                          {profile.templeRecommend === 'Sí' && (
                            <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">
                              Recomendación Templo: Sí
                            </span>
                          )}
                          {profile.servedMission.startsWith('Sí') && (
                            <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-indigo-300">
                              Misión Cumplida
                            </span>
                          )}
                        </div>

                        {/* Common Ground (3 a 7 Coincidencias Reales) */}
                        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 mb-2">
                          <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-pink-400" /> Puntos en Común ({compatibility.commonGround.length}):
                          </p>
                          <ul className="space-y-1">
                            {compatibility.commonGround.slice(0, 3).map((item, idx) => (
                              <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                                <span className="text-pink-400 font-bold">✓</span>
                                <span className="line-clamp-1">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Acciones de Interacción */}
                    <div className="p-5 pt-0 grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => setSelectedCandidate(profile)}
                        variant="outline"
                        className="w-full bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 rounded-xl text-xs font-semibold"
                      >
                        Ver Detalles
                      </Button>

                      <Button
                        onClick={() => handleLike(profile)}
                        className="w-full bg-gradient-to-r from-pink-600 to-[#9b4dca] hover:from-pink-500 hover:to-[#9b4dca]/90 text-white rounded-xl text-xs font-bold shadow-lg shadow-pink-500/20 flex items-center justify-center gap-1.5"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        <span>Hacer Klick</span>
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CHATS & MENSAJES */}
        {activeTab === 'chats' && (
          <div className="max-w-6xl mx-auto h-[calc(100vh-6rem)] grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Lista de Conversaciones */}
            <div className="md:col-span-4 bg-[#0d111a] border border-slate-800/80 rounded-3xl p-4 flex flex-col h-full overflow-hidden">
              <h3 className="text-lg font-bold text-white mb-4 px-2">Bandeja de Mensajes</h3>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {chats.map(thread => {
                  const isSelected = activeChatThread?.id === thread.id;
                  return (
                    <button
                      key={thread.id}
                      onClick={() => setActiveChatThread(thread)}
                      className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 transition-all border ${
                        isSelected
                          ? 'bg-pink-600/10 border-pink-500/40 text-white'
                          : 'bg-slate-900/50 border-slate-800/60 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <img
                        src={thread.candidate.photos[0]}
                        alt={thread.candidate.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-white truncate">{thread.candidate.name}</h4>
                          <span className="text-[10px] text-slate-500">{thread.lastMessageAt}</span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {thread.messages[thread.messages.length - 1]?.text || 'Nuevo Klick'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ventana de Chat Activa */}
            <div className="md:col-span-8 bg-[#0d111a] border border-slate-800/80 rounded-3xl flex flex-col h-full overflow-hidden">
              {activeChatThread ? (
                <>
                  {/* Header Chat */}
                  <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
                    <div className="flex items-center gap-3">
                      <img
                        src={activeChatThread.candidate.photos[0]}
                        alt={activeChatThread.candidate.name}
                        className="w-10 h-10 rounded-full object-cover border border-pink-500/40"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                          {activeChatThread.candidate.name}
                          <span className="text-xs text-pink-400 font-normal">({activeChatThread.compatibility.score}% Klick)</span>
                        </h4>
                        <p className="text-xs text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Identidad Verificada KYC
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setSelectedCandidate(activeChatThread.candidate);
                        setShowSafeDateModal(true);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Safe First Date
                    </Button>
                  </div>

                  {/* Mensajes */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {activeChatThread.messages.map(msg => {
                      const isMe = msg.senderId === currentUser.id;
                      const isSystem = msg.senderId === 'system';

                      if (isSystem) {
                        return (
                          <div key={msg.id} className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-center my-2">
                            <p className="text-xs text-pink-300 font-medium">{msg.text}</p>
                          </div>
                        );
                      }

                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] p-3.5 rounded-2xl text-sm ${
                            isMe
                              ? 'bg-gradient-to-r from-pink-600 to-[#9b4dca] text-white rounded-br-sm'
                              : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-sm'
                          }`}>
                            <p className="leading-relaxed">{msg.text}</p>
                            <span className="text-[10px] opacity-70 block text-right mt-1">{msg.timestamp}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSendChat} className="p-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center gap-3">
                    <Input
                      value={chatInputText}
                      onChange={e => setChatInputText(e.target.value)}
                      placeholder={canInitiateChat() ? "Escribe un mensaje respetuoso..." : "Suscripción Premium requerida para enviar mensajes..."}
                      className="flex-1 bg-slate-950 border-slate-800 rounded-xl text-sm text-white"
                      disabled={!canInitiateChat()}
                    />
                    <Button
                      type="submit"
                      disabled={!chatInputText.trim() && canInitiateChat()}
                      className="bg-pink-600 hover:bg-pink-500 text-white rounded-xl px-5"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
                  <MessageCircle className="w-12 h-12 mb-3 stroke-1 text-slate-600" />
                  <p>Selecciona una conversación para chatear.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SAFE FIRST DATE */}
        {activeTab === 'safedate' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <span className="text-emerald-400 font-bold tracking-wider text-xs uppercase bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Protocolo de Seguridad Presencial
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white mt-3">
                Mis Planes <span className="text-emerald-400">Safe First Date</span>
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Encuentros coordinados en lugares públicos, con horarios de bajo riesgo y sistema de check-in activo.
              </p>
            </div>

            {safeDatePlans.map(plan => (
              <div key={plan.id} className="bg-[#0d111a] border border-slate-800 rounded-3xl p-6 mb-6 shadow-xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-4">
                    <img
                      src={plan.candidatePhoto}
                      alt={plan.candidateName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40"
                    />
                    <div>
                      <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Cita Programada con</span>
                      <h3 className="text-xl font-bold text-white">{plan.candidateName}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-pink-400" /> {plan.dateTime}
                      </p>
                    </div>
                  </div>

                  <div>
                    {plan.status === 'checked_in' ? (
                      <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Check-in Confirmado: En el lugar
                      </div>
                    ) : (
                      <Button
                        onClick={() => checkInSafeDate(plan.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold px-5 py-2.5 shadow-lg shadow-emerald-600/20"
                      >
                        Confirmar Llegada (Check-in)
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-xs">
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                    <p className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-pink-400" /> Lugar Público:
                    </p>
                    <p className="text-white font-medium text-sm">{plan.venueName}</p>
                    <p className="text-slate-400 mt-0.5">{plan.venueAddress}</p>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                    <p className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-indigo-400" /> Contacto de Confianza (Ángel Guardián):
                    </p>
                    <p className="text-white font-medium text-sm">{plan.trustedContactName}</p>
                    <p className="text-slate-400 mt-0.5">{plan.trustedContactPhone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: MI PERFIL LDS */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto bg-[#0d111a] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-slate-800">
              <img
                src={currentUser.photos[0]}
                alt={currentUser.name}
                className="w-28 h-28 rounded-3xl object-cover border-4 border-pink-500/30"
              />
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h2 className="text-2xl font-black text-white">{currentUser.name}, {currentUser.age}</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    ✓ KYC Verificado
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{currentUser.occupation} • {currentUser.city}, {currentUser.state}</p>
                <p className="text-sm text-slate-300 mt-3 max-w-xl leading-relaxed">{currentUser.bio}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Fe LDS */}
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
                <h4 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
                  <Church className="w-4 h-4 text-pink-400" /> Fe y Valores LDS
                </h4>
                <div className="space-y-2 text-xs text-slate-300">
                  <p><strong className="text-slate-400">Comunidad:</strong> {currentUser.faith} ({currentUser.faithImportance})</p>
                  <p><strong className="text-slate-400">Recomendación para el Templo:</strong> {currentUser.templeRecommend}</p>
                  <p><strong className="text-slate-400">Servicio Misional:</strong> {currentUser.servedMission}</p>
                  <p><strong className="text-slate-400">Matrimonio en el Templo:</strong> {currentUser.templeMarriageRequirement}</p>
                </div>
              </div>

              {/* Matrimonio y Familia */}
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
                <h4 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-400" /> Matrimonio y Familia
                </h4>
                <div className="space-y-2 text-xs text-slate-300">
                  <p><strong className="text-slate-400">Meta:</strong> Búsqueda de Matrimonio ({currentUser.marriageTimeline})</p>
                  <p><strong className="text-slate-400">Hijos Deseados:</strong> {currentUser.wantsChildren}</p>
                  <p><strong className="text-slate-400">Estilo de Comunicación:</strong> {currentUser.communicationStyle}</p>
                  <p><strong className="text-slate-400">Idiomas:</strong> {currentUser.languages.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MEMBRESÍA & MONETIZACIÓN */}
        {activeTab === 'membership' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-pink-400 font-bold tracking-wider text-xs uppercase bg-pink-500/10 px-3.5 py-1.5 rounded-full border border-pink-500/20">
                Modelo de Acceso KLICK!
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-4">
                Planes de <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-[#9b4dca]">Membresía & Conexión</span>
              </h2>
              <p className="text-slate-400 text-sm mt-3">
                Transparencia total: Acceso gratuito completo para mujeres y modelo escalonado para hombres con pagos fiat (Stripe) y crypto (Solana USDC).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mujer Free */}
              <div className="bg-[#0d111a] border border-pink-500/30 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
                <div>
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Mujeres</span>
                  <h3 className="text-xl font-bold text-white mt-1">Acceso 100% Gratis</h3>
                  <div className="my-4">
                    <span className="text-3xl font-black text-white">$0</span>
                    <span className="text-xs text-slate-400"> / de por vida</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li>✓ Chats y mensajes ilimitados</li>
                    <li>✓ Ver Score y Common Ground</li>
                    <li>✓ Coordinar Safe First Date</li>
                    <li>✓ Verificación KYC incluida</li>
                  </ul>
                </div>
                <Button className="w-full bg-pink-600/20 text-pink-300 border border-pink-500/30 rounded-xl text-xs font-bold mt-6 cursor-default">
                  Plan Activo por Defecto
                </Button>
              </div>

              {/* Hombre Free */}
              <div className="bg-[#0d111a] border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hombres</span>
                  <h3 className="text-xl font-bold text-white mt-1">Exploración Básica</h3>
                  <div className="my-4">
                    <span className="text-3xl font-black text-white">$0</span>
                    <span className="text-xs text-slate-400"> / mensual</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li>✓ Explorar candidatos en Utah</li>
                    <li>✓ Ver Score 0-100% y 3 coincidencias</li>
                    <li>✓ Verificación KYC incluida</li>
                    <li className="text-slate-500">✗ Iniciar chats (Requiere VIP)</li>
                  </ul>
                </div>
                <Button
                  onClick={() => setUserRole('male_free')}
                  variant="outline"
                  className="w-full bg-slate-900 border-slate-800 text-slate-300 rounded-xl text-xs font-bold mt-6"
                >
                  Seleccionar Free
                </Button>
              </div>

              {/* Hombre VIP */}
              <div className="bg-[#0d111a] border-2 border-pink-500 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative">
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-pink-600 to-[#9b4dca] text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-md">
                  Recomendado
                </div>
                <div>
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Hombres VIP</span>
                  <h3 className="text-xl font-bold text-white mt-1">Membresía Premium</h3>
                  <div className="my-4">
                    <span className="text-3xl font-black text-white">$39.99</span>
                    <span className="text-xs text-slate-400"> / mes (o 35 USDC)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li>✓ Chats y conversaciones ilimitadas</li>
                    <li>✓ Desbloqueo de fe y metas detalladas</li>
                    <li>✓ Coordinar protocolo Safe First Date</li>
                    <li>✓ Perfil destacado con mayor visibilidad</li>
                  </ul>
                </div>
                <Button
                  onClick={() => {
                    setUserRole('male_premium');
                    toast.success('🎉 ¡Membresía Premium Activada con éxito!');
                  }}
                  className="w-full bg-gradient-to-r from-pink-600 to-[#9b4dca] text-white rounded-xl text-xs font-bold mt-6 shadow-lg shadow-pink-500/20"
                >
                  Activar Membresía VIP
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL DETALLES DEL CANDIDATO */}
      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0d111a] border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedCandidate(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-slate-900 border border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row gap-6 items-start mb-6">
                <img
                  src={selectedCandidate.photos[0]}
                  alt={selectedCandidate.name}
                  className="w-28 h-28 rounded-2xl object-cover border-2 border-pink-500/40"
                />
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    {selectedCandidate.name}, {selectedCandidate.age}
                    {selectedCandidate.verifiedKYC && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{selectedCandidate.occupation} • {selectedCandidate.city}, Utah</p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => {
                        handleLike(selectedCandidate);
                        setSelectedCandidate(null);
                      }}
                      className="bg-gradient-to-r from-pink-600 to-[#9b4dca] text-white rounded-xl text-xs font-bold px-4"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current mr-1" /> Hacer Klick
                    </Button>
                    <Button
                      onClick={() => {
                        setShowSafeDateModal(true);
                      }}
                      variant="outline"
                      className="bg-slate-900 border-slate-800 text-emerald-400 rounded-xl text-xs font-bold px-4"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Proponer Safe Date
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <h4 className="font-bold text-white mb-2">Biografía:</h4>
                  <p className="text-slate-300 leading-relaxed">{selectedCandidate.bio}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <h4 className="font-bold text-white mb-2">Fe LDS & Valores:</h4>
                    <p><strong>Comunidad:</strong> {selectedCandidate.faith}</p>
                    <p><strong>Recomendación Templo:</strong> {selectedCandidate.templeRecommend}</p>
                    <p><strong>Misión:</strong> {selectedCandidate.servedMission}</p>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <h4 className="font-bold text-white mb-2">Familia & Estilo de Vida:</h4>
                    <p><strong>Desea Hijos:</strong> {selectedCandidate.wantsChildren}</p>
                    <p><strong>Plazo Matrimonio:</strong> {selectedCandidate.marriageTimeline}</p>
                    <p><strong>Idiomas:</strong> {selectedCandidate.languages.join(', ')}</p>
                  </div>
                </div>

                {/* Acciones de Seguridad */}
                <div className="pt-4 flex justify-between items-center text-slate-500 text-[11px] border-t border-slate-800">
                  <button
                    onClick={() => {
                      blockUser(selectedCandidate.id, 'Bloqueado por usuario');
                      setSelectedCandidate(null);
                    }}
                    className="hover:text-amber-400 transition-colors"
                  >
                    🚫 Bloquear Usuario
                  </button>
                  <button
                    onClick={() => {
                      reportUser(selectedCandidate.id, 'Inapropiado', 'Reportado desde portal');
                      setSelectedCandidate(null);
                    }}
                    className="hover:text-rose-400 transition-colors"
                  >
                    ⚠️ Reportar a Trust & Safety
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL SAFE FIRST DATE FORM */}
      <AnimatePresence>
        {showSafeDateModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0d111a] border border-slate-800 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl"
            >
              <button
                onClick={() => setShowSafeDateModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase mb-2">
                <ShieldCheck className="w-4 h-4" /> Protocolo Safe First Date
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Coordinar Primera Cita Segura</h3>
              <p className="text-xs text-slate-400 mb-6">
                Selecciona un lugar público y horario diurno en Utah. Tu contacto de confianza recibirá un enlace privado.
              </p>

              <form onSubmit={handleScheduleSafeDate} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lugar Público Recomendado:</label>
                  <select
                    value={dateVenue}
                    onChange={e => {
                      setDateVenue(e.target.value);
                      if (e.target.value.includes('Sugar House')) setDateAddress('2011 S 1100 E, Salt Lake City, UT 84105');
                      if (e.target.value.includes('City Creek')) setDateAddress('50 S Main St, Salt Lake City, UT 84101');
                      if (e.target.value.includes('Provo')) setDateAddress('4801 N University Ave, Provo, UT 84604');
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                  >
                    <option value="Sugar House Coffee (Salt Lake City)">Sugar House Coffee (Salt Lake City)</option>
                    <option value="City Creek Center Plaza (Salt Lake City)">City Creek Center Plaza (Salt Lake City)</option>
                    <option value="The Shops at Riverwoods (Provo / Orem)">The Shops at Riverwoods (Provo / Orem)</option>
                    <option value="Town Square Park (St. George)">Town Square Park (St. George)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dirección del Lugar:</label>
                  <Input value={dateAddress} onChange={e => setDateAddress(e.target.value)} className="bg-slate-900 border-slate-800 text-white rounded-xl" />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fecha y Horario Seguro (Diurno):</label>
                  <Input value={dateTime} onChange={e => setDateTime(e.target.value)} className="bg-slate-900 border-slate-800 text-white rounded-xl" />
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <label className="block text-slate-300 font-semibold mb-1">Nombre de Contacto de Confianza (Hermano/a, Amigo/a):</label>
                  <Input value={trustedName} onChange={e => setTrustedName(e.target.value)} placeholder="Ej. María Morales" className="bg-slate-900 border-slate-800 text-white rounded-xl mb-3" />

                  <label className="block text-slate-300 font-semibold mb-1">Teléfono del Contacto de Confianza:</label>
                  <Input value={trustedPhone} onChange={e => setTrustedPhone(e.target.value)} placeholder="+1 (801) 555-0199" className="bg-slate-900 border-slate-800 text-white rounded-xl" />
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl mt-4">
                  Confirmar y Activar Safe First Date
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL UPGRADE SUSCRIPCIÓN */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0d111a] border border-pink-500/50 rounded-3xl max-w-md w-full p-6 relative shadow-2xl text-center"
            >
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Desbloquea Conversaciones Ilimitadas</h3>
              <p className="text-xs text-slate-400 mb-6">
                Para mantener una comunidad de alta calidad y libre de spam en Utah, los hombres requieren Membresía Premium para iniciar chats.
              </p>

              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setUserRole('male_premium');
                    setShowUpgradeModal(false);
                    toast.success('🎉 ¡Membresía VIP Activada! Ya puedes enviar mensajes.');
                  }}
                  className="w-full bg-gradient-to-r from-pink-600 to-[#9b4dca] text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-500/20"
                >
                  Activar Membresía VIP ($39.99/mes)
                </Button>

                <Button
                  onClick={() => {
                    setUserRole('female');
                    setShowUpgradeModal(false);
                    toast.info('Cambiado a rol Femenino (Gratuito)');
                  }}
                  variant="outline"
                  className="w-full bg-slate-900 border-slate-800 text-slate-400 text-xs"
                >
                  Probar como Usuaria Femenina (100% Gratis)
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
