'use client';

import Link from 'next/link';
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  Video,
  Download,
  Home,
  ShoppingBag,
} from 'lucide-react';

interface PortalSidebarProps {
  activeTopSection: 'membresia-vip' | 'membresia-basica' | 'experto';
  activeSection: string;
  isSidebarCollapsed: boolean;
}

export default function PortalSidebar({
  activeTopSection,
  activeSection,
  isSidebarCollapsed,
}: PortalSidebarProps) {
  if (activeTopSection !== 'membresia-vip' && activeTopSection !== 'membresia-basica') {
    return null;
  }

  const isVip = activeTopSection === 'membresia-vip';
  const plansHref = isVip ? '/portal/membresía-vip' : '/portal/membresía-basico';
  const plansLabel = isVip ? 'Planes Membresía VIP' : 'Planes Membresía B-2';
  const procesoLabel = isVip ? 'Mi proceso de admisión' : 'Mi proceso de solicitud';
  const sectionLabel = isVip ? 'Membresía VIP' : 'Membresía Básica B-2';
  const landingHref = isVip
    ? 'https://www.klick.com/membership/vip'
    : 'https://www.klick.com/membership/basic';

  const linkClass = (isActive: boolean) =>
    `px-4 py-2.5 md:py-3 text-[10px] md:text-xs font-normal tracking-widest md:tracking-wider uppercase rounded-full md:rounded-xl shrink-0 transition-all duration-300 flex items-center gap-3 ${
      isSidebarCollapsed ? 'justify-center' : 'justify-start text-left'
    } ${
      isActive
        ? 'text-purple-400 bg-white/5 border border-purple-500/30'
        : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
    }`;

  return (
    <aside
      className={`shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-white/5 transition-all duration-300 ${
        isSidebarCollapsed ? 'w-full md:w-20 md:pr-2' : 'w-full md:w-64 md:pr-6'
      }`}
    >
      {!isSidebarCollapsed && (
        <div className="hidden md:block px-3 py-1.5 text-[10px] font-semibold tracking-widest text-white/40 uppercase mb-2">
          {sectionLabel}
        </div>
      )}

      <Link
        href="/portal/proceso"
        title={isSidebarCollapsed ? procesoLabel : undefined}
        className={linkClass(activeSection === 'proceso')}
      >
        {isVip ? (
          <GraduationCap className="w-4 h-4 shrink-0" />
        ) : (
          <Briefcase className="w-4 h-4 shrink-0" />
        )}
        {!isSidebarCollapsed && <span>{procesoLabel}</span>}
      </Link>

      <Link
        href={plansHref}
        title={isSidebarCollapsed ? plansLabel : undefined}
        className={linkClass(activeSection === 'membresia-vip' || activeSection === 'membresia-basica')}
      >
        <ShoppingBag className="w-4 h-4 shrink-0" />
        {!isSidebarCollapsed && <span>{plansLabel}</span>}
      </Link>

      <Link
        href="/portal/curso"
        title={isSidebarCollapsed ? 'Master class express' : undefined}
        className={linkClass(activeSection === 'curso')}
      >
        <Video className="w-4 h-4 shrink-0" />
        {!isSidebarCollapsed && <span>Master class express</span>}
      </Link>

      <Link
        href="/portal/libro"
        title={isSidebarCollapsed ? 'Libro digital' : undefined}
        className={linkClass(activeSection === 'libro')}
      >
        <BookOpen className="w-4 h-4 shrink-0" />
        {!isSidebarCollapsed && <span>Libro digital</span>}
      </Link>

      <Link
        href="/portal/recursos"
        title={isSidebarCollapsed ? 'Recursos adicionales' : undefined}
        className={linkClass(activeSection === 'recursos')}
      >
        <Download className="w-4 h-4 shrink-0" />
        {!isSidebarCollapsed && <span>Recursos adicionales</span>}
      </Link>

      <a
        href={landingHref}
        target="_blank"
        rel="noopener noreferrer"
        title={isSidebarCollapsed ? 'Sitio web' : undefined}
        className={`${linkClass(false)} opacity-80`}
      >
        <Home className="w-4 h-4 shrink-0" />
        {!isSidebarCollapsed && <span>Sitio web</span>}
      </a>
    </aside>
  );
}
