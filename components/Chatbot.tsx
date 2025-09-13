// dopekuts/components/Chatbot.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bot, MessageCircle, X, Send, Calendar, Scissors, Clock } from 'lucide-react';

type Msg = { id: string; from: 'roy' | 'user'; text: string; time?: string };

const initialMessages: Msg[] = [
  { id: 'm1', from: 'roy', text: "Hi there! I'm Roy, your personal barbershop assistant. 👋 How can I help you today?" },
  { id: 'm2', from: 'roy', text: 'I can help you:\n• Book appointments 📅\n• View our services ✂️\n• Check availability ⏱️\n• Answer questions about our barbershop' },
];

const quickActions = [
  { id: 'qa1', label: 'Book Appointment', icon: Calendar, fill: 'book' },
  { id: 'qa2', label: 'View Services', icon: Scissors, fill: 'services' },
  { id: 'qa3', label: 'Check Availability', icon: Clock, fill: 'availability' },
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendUser = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { id: crypto.randomUUID(), from: 'user', text }]);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          from: 'roy',
          text:
            "Thanks! I'm using demo data right now. When we hook the backend, I’ll take real actions for you. Anything else I can help with?",
        },
      ]);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendUser(input);
    setInput('');
  };

  const handleQuick = (kind: 'book' | 'services' | 'availability') => {
    let reply = '';
    if (kind === 'book') {
      reply =
        "Great choice! To book an appointment, tap **Book Now** below or tell me your preferred date and time. (Demo mode)";
    } else if (kind === 'services') {
      reply =
        "Here are our popular services: Classic Cut, Beard Grooming, Premium Package, Express Service. What would you like to know? (Demo mode)";
    } else {
      reply = "Our typical availability is Mon–Sat, 9am–7pm. Tell me a day and I’ll check slots. (Demo mode)";
    }
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), from: 'user', text: quickActions.find((q) => q.fill === kind)!.label },
      { id: crypto.randomUUID(), from: 'roy', text: reply },
    ]);
  };

  return (
    <>
      {/* FAB with arched label */}
      <div className={`fixed bottom-6 right-6 z-[60] ${open ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="relative w-[72px] h-[72px]">
          {/* Curved label hugging the upper hemisphere */}
          <svg
            viewBox="0 0 72 44"
            className="pointer-events-none absolute -top-[2px] left-0 w-[72px] h-[44px]"
            aria-hidden="true"
          >
            {/* Semi-circle path that exactly follows the button's top edge (button is 64px inside 72px box) */}
            <defs>
              {/* Button circle center ~ (36,36), radius 32 => top at y=4, we draw arc slightly above for breathing room */}
              <path id="t2r-arc" d="M 4 36 A 32 32 0 0 1 68 36" />
            </defs>
            {/* Stroke-first paint order for a halo that works on light or dark backgrounds */}
            <text
              fill="#ffffff"
              stroke="rgba(0,0,0,0.55)"
              strokeWidth="2"
              fontSize="12"
              fontWeight="700"
              style={{ paintOrder: 'stroke' }}
            >
              {/* Start at left-most of the arc; text flows left -> right along the top */}
              <textPath href="#t2r-arc" startOffset="0%">
                Talk2Roy🎤
              </textPath>
            </text>
          </svg>

          {/* Button itself (64x64) centered within container */}
          <button
            aria-label="Open chatbot"
            onClick={() => setOpen(true)}
            className="absolute bottom-0 right-0 w-16 h-16 rounded-full grid place-items-center shadow-xl transition-all
                       bg-gradient-to-br from-purple-600 to-indigo-600 text-white hover:scale-105"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-[60] w-[92vw] max-w-[420px] h-[70vh] max-h-[720px]
          rounded-3xl border backdrop-blur-xl shadow-2xl
          bg-[#f8f8f8]/90 border-white/30 dark:bg-gray-900/60 dark:border-white/10"
        >
          <div className="flex h-full flex-col">
            {/* Header (unchanged strip color) */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 rounded-t-3xl
                bg-[#efefef]/80 backdrop-blur-xl border-b border-white/30 dark:bg-gray-900/60 dark:border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <span className="absolute -right-0 -bottom-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="leading-tight">
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">Talk2Roy</div>
                  <div className="text-[11px] text-gray-600 dark:text-gray-300">Roy • Online</div>
                </div>
              </div>
              <button
                aria-label="Close chatbot"
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition"
              >
                <X className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 pt-2 pb-4" aria-live="polite">
              {messages.map((m, i) => {
                const prev = messages[i - 1];
                const isNewRoyGroup = m.from === 'roy' && prev?.from !== 'roy';
                return (
                  <div
                    key={m.id}
                    className={`flex mb-3 ${m.from === 'user' ? 'justify-end' : 'justify-start'} ${
                      !isNewRoyGroup && m.from === 'roy' ? 'pl-9' : ''
                    }`}
                  >
                    {m.from === 'roy' && isNewRoyGroup && (
                      <div className="mr-2 mt-1 h-7 w-7 flex-shrink-0 rounded-full bg-black/80 dark:bg-white/80 grid place-items-center text-white dark:text-black">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-3 py-2 max-w-[80%] leading-relaxed text-sm backdrop-blur-lg border
                        ${
                          m.from === 'user'
                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg border-indigo-500/30'
                            : 'bg-[#f8f8f8] text-gray-900 border-white/30 dark:bg-gray-800/70 dark:text-white dark:border-white/10'
                        }`}
                    >
                      {m.text.split('\n').map((line, idx) => (
                        <p key={idx} className="whitespace-pre-wrap">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            {/* Quick actions */}
            <div className="px-3 pb-2">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {quickActions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleQuick(q.fill as any)}
                    className="flex items-center gap-2 rounded-full px-3 py-2 text-sm
                    bg-[#f8f8f8] border-2 border-indigo-500/30 hover:border-indigo-500/60
                    backdrop-blur-md text-gray-900 transition whitespace-nowrap
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/25
                    dark:bg-gray-800/70 dark:text-white dark:border-indigo-400/35 dark:hover:border-indigo-400/60"
                  >
                    <q.icon className="h-4 w-4" />
                    {q.label}
                  </button>
                ))}
                <Link
                  href="/book"
                  className="rounded-full px-3 py-2 text-sm bg-black/80 text-white border-2 border-indigo-500/60 hover:border-indigo-500/80 backdrop-blur-md transition"
                >
                  Book Now
                </Link>
              </div>
            </div>

            {/* Composer */}
            <form onSubmit={handleSubmit} className="px-3 pb-3">
              <div
                className="flex items-center gap-2 rounded-2xl px-3 h-12
                bg-[#f8f8f8] backdrop-blur-xl border-2 border-indigo-500/30
                focus-within:border-indigo-500/70 focus-within:ring-2 focus-within:ring-indigo-500/20
                dark:bg-gray-800/70 dark:border-indigo-400/35 dark:focus-within:border-indigo-400/70 dark:focus-within:ring-indigo-400/20"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message…"
                  className="flex-1 h-full bg-transparent outline-none text-sm leading-none text-gray-900 placeholder:text-gray-500 dark:text-white dark:placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white hover:opacity-90 transition disabled:opacity-50"
                  disabled={!input.trim()}
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
