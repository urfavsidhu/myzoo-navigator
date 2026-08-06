import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PartyPopper, RotateCcw } from "lucide-react";
import { AppShell, PageHeader } from "@/components/zoo/AppShell";
import { quizQuestions } from "@/data/zoo-data";
import { useAppPrefs } from "@/lib/app-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Animal Quiz for Kids — Smart Zoo Navigator" },
      {
        name: "description",
        content: "A fun four-question animal quiz for young visitors to Uttar Pradesh zoos.",
      },
      { property: "og:title", content: "Animal Quiz for Kids — Smart Zoo Navigator" },
      {
        property: "og:description",
        content: "Test what you know about tigers, elephants, peacocks and giraffes.",
      },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const { t, lang } = useAppPrefs();
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const done = step >= quizQuestions.length;
  const q = quizQuestions[step];

  const choose = (i: number) => {
    if (picked !== null || !q) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
    setTimeout(() => {
      setPicked(null);
      setStep((s) => s + 1);
    }, 700);
  };

  return (
    <AppShell>
      <PageHeader
        title={t("page.quiz")}
        subtitle={
          done
            ? lang === "hi"
              ? "क्विज़ पूरा हुआ"
              : "Quiz complete"
            : `${lang === "hi" ? "प्रश्न" : "Question"} ${step + 1} / ${quizQuestions.length}`
        }
      />
      <div className="space-y-4 px-4 pb-8">
        {done ? (
          <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-card">
            <PartyPopper className="mx-auto h-12 w-12 text-sun" />
            <p className="mt-3 text-sm text-muted-foreground">{t("label.score")}</p>
            <p className="font-display text-4xl font-semibold text-leaf">
              {score} / {quizQuestions.length}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={() => {
                  setStep(0);
                  setScore(0);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                <RotateCcw className="h-4 w-4" /> {lang === "hi" ? "फिर से खेलें" : "Play again"}
              </button>
              <Link
                to="/hunt"
                className="rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold"
              >
                {t("page.hunt")}
              </Link>
            </div>
          </div>
        ) : q ? (
          <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
            <h2 className="text-lg font-semibold">
              {lang === "hi" ? q.questionHi : q.question}
            </h2>
            <div className="mt-4 grid gap-2">
              {(lang === "hi" ? q.optionsHi : q.options).map((opt, i) => (
                <button
                  key={opt}
                  onClick={() => choose(i)}
                  className={cn(
                    "rounded-2xl border border-border bg-secondary/60 px-4 py-4 text-left text-base font-semibold transition-transform active:scale-95",
                    picked !== null &&
                      i === q.answer &&
                      "border-leaf bg-leaf/15 text-leaf",
                    picked === i &&
                      i !== q.answer &&
                      "border-destructive bg-destructive/10 text-destructive",
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}