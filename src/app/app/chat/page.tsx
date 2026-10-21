'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, CalendarHeart, Lock, Send } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { DEMO, demoStore } from '@/lib/demo';
import { Spinner } from '@/components/app/form';
import SafetyMenu from '@/components/app/SafetyMenu';
import { cn } from '@/lib/utils';
import { useMatch, useMessages } from '@/hooks/useKlickData';

function Chat() {
  const id = useSearchParams().get('id');
  const router = useRouter();
  const { user, entitlement } = useAuth();
  const { match, missing } = useMatch(id);
  const messages = useMessages(id);
  const [text, setText] = useState('');
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (missing) router.replace('/app/matches/');
  }, [missing, router]);

  useEffect(() => bottom.current?.scrollIntoView({ behavior: 'smooth' }), [messages.length]);

  if (!id || !match || !user) return <div className="flex h-dvh items-center justify-center"><Spinner className="h-8 w-8" /></div>;

  const otherId = match.members.find((m) => m !== user.uid)!;
  const other = match.profiles[otherId];
  const canChat = entitlement?.canChat === true && match.status === 'active';

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t || !canChat) return;
    setText('');
    if (DEMO) return demoStore.send(id, t);
    try {
      await addDoc(collection(db, `matches/${id}/messages`), { senderId: user.uid, text: t, createdAt: serverTimestamp() });
    } catch {
      setText(t);
      toast.error('No se pudo enviar el mensaje');
    }
  };

  return (
    <div className="flex h-dvh flex-col">
      <header className="glass flex items-center gap-3 border-x-0 border-t-0 px-3 py-3 pt-safe">
        <Link href="/app/matches/" aria-label="Volver" className="rounded-full p-1.5"><ArrowLeft className="h-6 w-6" /></Link>
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-muted">
          {other?.photo && <Image src={other.photo} alt="" fill unoptimized className="object-cover" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold leading-tight">{other?.name}</p>
          <p className="text-xs font-semibold text-primary">♥ {Math.round(match.score)}% Klick</p>
        </div>
        <Link href={`/app/safe-date/?matchId=${id}`} aria-label="Planear Safe First Date" className="rounded-full bg-primary/15 p-2.5 text-primary"><CalendarHeart className="h-5 w-5" /></Link>
        <SafetyMenu targetId={otherId} matchId={id} onDone={() => router.replace('/app/matches/')} />
      </header>

      <div className="flex-1 space-y-2.5 overflow-y-auto p-4">
        {messages.length === 0 && match.commonGround.length > 0 && (
          <div className="surface p-5 text-sm">
            <p className="mb-2 font-bold">Para romper el hielo</p>
            <ul className="space-y-1.5 text-foreground/80">{match.commonGround.slice(0, 4).map((g) => <li key={g} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{g}</li>)}</ul>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cn('flex', m.senderId === user.uid ? 'justify-end' : 'justify-start')}>
            <p className={cn('max-w-[78%] whitespace-pre-wrap break-words px-4 py-2.5 text-[15px] leading-snug', m.senderId === user.uid ? 'rounded-3xl rounded-br-md bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/20' : 'rounded-3xl rounded-bl-md bg-muted')}>{m.text}</p>
          </div>
        ))}
        <div ref={bottom} />
      </div>

      {canChat ? (
        <form onSubmit={send} className="flex gap-2 p-3 pb-safe">
          <input value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} placeholder="Escribe un mensaje…" className="flex-1 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3.5 outline-none focus:border-primary/70" />
          <button className="btn-brand !rounded-full !p-3.5" aria-label="Enviar"><Send className="h-5 w-5" /></button>
        </form>
      ) : (
        <Link href="/app/upgrade/" className="flex items-center justify-center gap-2 bg-primary/15 p-4 pb-safe text-sm font-semibold text-primary">
          <Lock className="h-4 w-4" /> Hazte Premium para iniciar la conversación
        </Link>
      )}
    </div>
  );
}

export default function ChatPage() {
  return <Suspense fallback={null}><Chat /></Suspense>;
}
