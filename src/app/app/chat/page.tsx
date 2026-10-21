'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, CalendarHeart, Lock, Send } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
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
    try {
      await addDoc(collection(db, `matches/${id}/messages`), { senderId: user.uid, text: t, createdAt: serverTimestamp() });
    } catch {
      setText(t);
      toast.error('No se pudo enviar el mensaje');
    }
  };

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center gap-3 border-b px-3 py-3">
        <Link href="/app/matches/" aria-label="Volver"><ArrowLeft className="h-6 w-6" /></Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{other?.name}</p>
          <p className="text-xs text-primary">{Math.round(match.score)}% Klick</p>
        </div>
        <Link href={`/app/safe-date/?matchId=${id}`} aria-label="Planear Safe First Date" className="rounded-full bg-primary/15 p-2 text-primary"><CalendarHeart className="h-5 w-5" /></Link>
        <div className="[&_button]:bg-muted [&_button]:text-foreground"><SafetyMenu targetId={otherId} matchId={id} onDone={() => router.replace('/app/matches/')} /></div>
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {messages.length === 0 && match.commonGround.length > 0 && (
          <div className="rounded-2xl border bg-card p-4 text-sm">
            <p className="mb-1 font-semibold">Para romper el hielo</p>
            <ul className="space-y-1 text-muted-foreground">{match.commonGround.slice(0, 4).map((g) => <li key={g}>• {g}</li>)}</ul>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cn('flex', m.senderId === user.uid ? 'justify-end' : 'justify-start')}>
            <p className={cn('max-w-[78%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-[15px]', m.senderId === user.uid ? 'rounded-br-sm bg-primary text-primary-foreground' : 'rounded-bl-sm bg-muted')}>{m.text}</p>
          </div>
        ))}
        <div ref={bottom} />
      </div>

      {canChat ? (
        <form onSubmit={send} className="flex gap-2 border-t p-3 pb-safe">
          <input value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} placeholder="Escribe un mensaje…" className="flex-1 rounded-full border border-input bg-background px-4 py-3 outline-none focus:border-primary" />
          <button className="rounded-full bg-primary p-3 text-primary-foreground" aria-label="Enviar"><Send className="h-5 w-5" /></button>
        </form>
      ) : (
        <Link href="/app/upgrade/" className="flex items-center justify-center gap-2 border-t bg-primary/10 p-4 pb-safe text-sm font-medium text-primary">
          <Lock className="h-4 w-4" /> Hazte Premium para iniciar la conversación
        </Link>
      )}
    </div>
  );
}

export default function ChatPage() {
  return <Suspense fallback={null}><Chat /></Suspense>;
}
