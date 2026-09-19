import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import {
  METERS_PER_MAP_UNIT,
  distanceFrom,
  facilities,
  walkMinutes,
  youAreHere,
  zooAnimals,
} from "@/data/zoo-data";
import { useAppPrefs } from "@/lib/app-context";
import { useZoo } from "@/lib/zoo-context";
import { cn } from "@/lib/utils";
import { DraggableFab } from "@/components/zoo/DraggableFab";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function ChatAssistant() {
  const { zoo, zooId } = useZoo();
  const { lang } = useAppPrefs();
  const hi = lang === "hi";
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  const suggestions = hi
    ? ["सफेद बाघ कहाँ है?", "नज़दीकी शौचालय?", "शेर तक कितनी दूर?"]
    : ["Where is the white tiger?", "Nearest washroom?", "How far is the lion enclosure?"];

  const send = async (raw: string) => {
    const question = raw.trim();
    if (!question || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setLoading(true);

    const context = {
      zoo: {
        name: zoo.name,
        city: zoo.city,
        hours: zoo.hours,
        closedOn: zoo.closedOn,
        tickets: zoo.tickets,
        shows: zoo.shows,
      },
      youAreHere,
      metersPerMapUnit: METERS_PER_MAP_UNIT,
      animals: zooAnimals(zooId).map((a) => ({
        name: a.name,
        nameHi: a.nameHi,
        enclosure: a.enclosure,
        feedingTime: a.feedingTime,
        habitat: a.habitat,
        diet: a.diet,
        crowdLevel: a.crowdLevel,
        x: a.x,
        y: a.y,
        distanceFromVisitorM: distanceFrom(youAreHere, a),
        walkMinutesFromVisitor: walkMinutes(distanceFrom(youAreHere, a)),
      })),
      facilities: facilities.map((f) => ({
        name: f.name,
        kind: f.kind,
        description: f.description,
        x: f.x,
        y: f.y,
        distanceFromVisitorM: distanceFrom(youAreHere, f),
        walkMinutesFromVisitor: walkMinutes(distanceFrom(youAreHere, f)),
      })),
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, context, lang }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok || !data.text) {
        throw new Error(data.error ?? "empty");
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.text as string }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: hi
            ? "क्षमा करें, अभी जवाब नहीं मिल पाया। कृपया थोड़ी देर बाद फिर पूछें — तब तक नक्शा और जानवर पेज देखें।"
            : "Sorry, I couldn't reach the guide just now. Please try again in a moment — meanwhile the Map and Animals pages have the same details.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DraggableFab
        onClick={() => setOpen(true)}
        ariaLabel={hi ? "ज़ू सहायक" : "Zoo assistant"}
        storageKey="fab-chat-pos"
        defaultPositionClassName="bottom-44 right-4"
        colorClassName="bg-primary text-primary-foreground"
      >
        <MessageCircle className="h-6 w-6" />
      </DraggableFab>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <button
            aria-label="Close assistant"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
          />
          <div className="relative flex h-[78vh] w-full max-w-2xl flex-col rounded-t-3xl border border-border bg-card shadow-float">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-leaf/15 text-leaf">
                <Bot className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold">
                  {hi ? "ज़ू सहायक" : "Zoo Assistant"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {zoo.name} · {hi ? "असली ज़ू डेटा से जवाब" : "answers from real zoo data"}
                </p>
              </div>
              <button
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="rounded-full bg-secondary p-1.5 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {hi
                      ? "नमस्ते! जानवरों, रास्तों और सुविधाओं के बारे में कुछ भी पूछें।"
                      : "Hi! Ask me about animals, walking routes or facilities in this zoo."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => void send(s)}
                        className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {messages.map((m, i) => (
                <div
                  key={`${m.role}-${i}`}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/70 text-foreground",
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading ? (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-secondary/70 px-3.5 py-2.5 text-sm text-muted-foreground">
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-leaf [animation-delay:-0.2s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-leaf [animation-delay:-0.1s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-leaf" />
                    </span>
                    {hi ? "सोच रहा हूँ…" : "Looking it up…"}
                  </div>
                </div>
              ) : null}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="flex items-center gap-2 border-t border-border px-4 py-3 pb-5"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={hi ? "अपना सवाल लिखें…" : "Ask about the zoo…"}
                className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-90 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
