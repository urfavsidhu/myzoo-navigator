import { createFileRoute } from "@tanstack/react-router";

type ChatMessage = { role: "user" | "assistant"; content: string };

type Body = {
  messages?: ChatMessage[];
  context?: unknown;
  lang?: "en" | "hi";
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as Body;
        const messages = Array.isArray(body.messages) ? body.messages : [];
        if (messages.length === 0) {
          return new Response(JSON.stringify({ error: "No messages" }), { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
            status: 500,
          });
        }

        const hindi = body.lang === "hi";
        const system = [
          "You are the Smart Zoo Navigator assistant, a friendly guide inside an Indian zoo app.",
          hindi
            ? "Reply ONLY in Hindi (Devanagari script)."
            : "Reply ONLY in English.",
          "Answer strictly using the JSON zoo data below. Never invent animals, facilities, timings or locations that are not in the data.",
          "If something is not in the data, say you do not have that information and suggest the closest option that is.",
          "Coordinates x/y are percentages on the zoo map; the visitor ('You are here') position is included. Roughly 1 map unit = 4 metres and people walk about 75 m/min — use that for distance/time estimates and round sensibly.",
          "Keep answers short (2-4 sentences), warm and practical. Use the enclosure name when giving directions.",
          "Reply in plain conversational text only — no markdown, no asterisks, no bullet symbols.",
          `ZOO DATA JSON:\n${JSON.stringify(body.context ?? {})}`,
        ].join("\n\n");

        try {
          const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": key,
              "X-Lovable-AIG-SDK": "fetch",
            },
            body: JSON.stringify({
              model: "openai/gpt-5.6-sol",
              stream: true,
              instructions: system,
              input: messages.map((m) => ({
                role: m.role,
                content: [
                  {
                    type: m.role === "assistant" ? "output_text" : "input_text",
                    text: m.content,
                  },
                ],
              })),
            }),
          });

          if (!res.ok || !res.body) {
            const detail = await res.text().catch(() => "");
            return new Response(JSON.stringify({ error: detail || "Gateway error" }), {
              status: res.status === 429 || res.status === 402 ? res.status : 502,
            });
          }

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          let text = "";

          while (true) {
            const chunk = await reader.read();
            if (chunk.done) break;
            buffer += decoder.decode(chunk.value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const payload = trimmed.slice(5).trim();
              if (!payload || payload === "[DONE]") continue;
              try {
                const evt = JSON.parse(payload) as {
                  type?: string;
                  delta?: string;
                  response?: { output_text?: string };
                };
                if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
                  text += evt.delta;
                } else if (
                  evt.type === "response.completed" &&
                  !text &&
                  evt.response?.output_text
                ) {
                  text = evt.response.output_text;
                }
              } catch {
                // ignore malformed SSE line
              }
            }
          }

          return Response.json({ text: text.trim() });
        } catch (error) {
          return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
            { status: 500 },
          );
        }
      },
    },
  },
});