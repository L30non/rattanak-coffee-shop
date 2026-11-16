"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { MessageCircle, RotateCcw, Send, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { useI18n } from "@/lib/i18n";
import { hrefToView } from "@/lib/routes";
import { CONTACT_PHONE_DISPLAY } from "@/lib/contact";

interface ChatWidgetProps {
  onNavigate: (view: string) => void;
}

type ChatMessage = { role: "user" | "model"; text: string };

const STORAGE_KEY = "rattanak-chat";
const MAX_INPUT_LENGTH = 2000;

// Full URLs, or site paths such as /product/abc or /contact that the
// assistant is told to include when it mentions a page.
const LINK_PATTERN = /(https?:\/\/[^\s)]*[^\s).,!?;:]|(?<![\w.:/])\/[a-z][\w\-/]*)/g;

function loadHistory(): ChatMessage[] {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(messages: ChatMessage[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Storage blocked (private mode etc.) — the chat still works, unsaved.
  }
}

export function ChatWidget({ onNavigate }: ChatWidgetProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  // Only the launcher button renders until the panel opens, so reading
  // sessionStorage here can't cause a hydration mismatch.
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, pending, open]);

  const send = async (history: ChatMessage[]) => {
    setMessages(history);
    setPending(true);
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;
    let reply = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        throw new Error(String(response.status));
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "model", text: reply }]);
      }
      if (!reply.trim()) throw new Error("empty");
      saveHistory([...history, { role: "model", text: reply }]);
    } catch (err) {
      if (controller.signal.aborted) return;
      setMessages(history);
      saveHistory(history);
      setError(
        err instanceof Error && err.message === "429"
          ? t("You're sending messages too quickly. Please wait a few minutes.")
          : t("Sorry, I couldn't answer just now. Please try again, or call us on {phone}.", {
              phone: CONTACT_PHONE_DISPLAY,
            }),
      );
    } finally {
      setPending(false);
    }
  };

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    setInput("");
    send([...messages, { role: "user", text: trimmed }]);
  };

  const clear = () => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    saveHistory([]);
  };

  const renderText = (text: string) =>
    text.split(LINK_PATTERN).map((part, index) => {
      if (index % 2 === 0) return <Fragment key={index}>{part}</Fragment>;
      if (part.startsWith("/")) {
        return (
          <button
            key={index}
            type="button"
            className="underline text-brand hover:text-brand-dark"
            onClick={() => {
              onNavigate(hrefToView(part));
              setOpen(false);
            }}
          >
            {part}
          </button>
        );
      }
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-brand hover:text-brand-dark break-all"
        >
          {part}
        </a>
      );
    });

  const starters = [
    t("What coffee machines do you sell?"),
    t("Do you deliver to the provinces?"),
    t("How can I place an order?"),
  ];

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-brand hover:bg-brand-dark shadow-lg"
        aria-label={t("Chat with us")}
      >
        <MessageCircle className="!h-6 !w-6" />
      </Button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label={t("Rattanak Coffee assistant")}
      onKeyDown={event => event.key === "Escape" && setOpen(false)}
      className="fixed z-50 inset-x-4 bottom-4 sm:inset-x-auto sm:right-4 sm:w-96 h-[min(32rem,calc(100dvh-2rem))] flex flex-col rounded-xl border bg-white shadow-2xl"
    >
      <div className="flex items-center justify-between gap-2 rounded-t-xl bg-brand px-4 py-3 text-white">
        <div>
          <p className="font-semibold leading-tight">{t("Rattanak Coffee")}</p>
          <p className="text-xs text-brand-soft">{t("Ask us anything")}</p>
        </div>
        <div className="flex gap-1">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clear}
              className="text-white hover:bg-brand-dark hover:text-white"
              aria-label={t("Start a new chat")}
            >
              <RotateCcw />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="text-white hover:bg-brand-dark hover:text-white"
            aria-label={t("Close chat")}
          >
            <X />
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3" aria-live="polite">
        <div className="max-w-[85%] rounded-lg bg-brand-tint px-3 py-2 text-sm">
          {t("Hi! I'm the Rattanak Coffee assistant. Ask me about our coffee, machines, services or orders.")}
        </div>

        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {starters.map(starter => (
              <button
                key={starter}
                type="button"
                onClick={() => submit(starter)}
                className="rounded-full border border-brand-soft px-3 py-1 text-xs text-brand hover:bg-brand-tint"
              >
                {starter}
              </button>
            ))}
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user"
                ? "ml-auto max-w-[85%] rounded-lg bg-brand px-3 py-2 text-sm text-white whitespace-pre-wrap break-words"
                : "max-w-[85%] rounded-lg bg-brand-tint px-3 py-2 text-sm whitespace-pre-wrap break-words"
            }
          >
            {message.role === "model" ? renderText(message.text) : message.text}
          </div>
        ))}

        {pending && messages.at(-1)?.role === "user" && (
          <div className="w-fit rounded-lg bg-brand-tint px-3 py-2 text-sm text-gray-500" aria-label={t("Typing…")}>
            <span className="animate-pulse">●●●</span>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}{" "}
            <button
              type="button"
              className="underline font-medium"
              onClick={() => send(messages)}
            >
              {t("Try again")}
            </button>
          </div>
        )}
      </div>

      <form
        className="flex items-end gap-2 border-t p-3"
        onSubmit={event => {
          event.preventDefault();
          submit(input);
        }}
      >
        <Textarea
          ref={inputRef}
          value={input}
          onChange={event => setInput(event.target.value)}
          onKeyDown={event => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              submit(input);
            }
          }}
          maxLength={MAX_INPUT_LENGTH}
          rows={1}
          placeholder={t("Type your question…")}
          aria-label={t("Your message")}
          className="min-h-10 max-h-32"
        />
        <Button
          type="submit"
          size="icon"
          disabled={pending || !input.trim()}
          className="shrink-0 bg-brand hover:bg-brand-dark"
          aria-label={t("Send")}
        >
          <Send />
        </Button>
      </form>
    </div>
  );
}
