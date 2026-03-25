import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { AIEnvSchema } from "@/lib/env";
import { inngest } from "./client";
import { DEFAULT_AI_QUESTION } from "./constants";

AIEnvSchema.parse(process.env);

export const execute = inngest.createFunction(
  { id: "execute", triggers: [{ event: "workflow/execute" }] },
  async ({ event, step }) => {
    const question =
      typeof event.data?.question === "string" && event.data.question
        ? event.data.question
        : DEFAULT_AI_QUESTION;

    const [openaiResult, geminiResult, anthropicResult] = await Promise.all([
      step.ai.wrap("ask-openai", generateText, {
        model: openai("gpt-4o-mini"),
        prompt: question,
      }),
      step.ai.wrap("ask-gemini", generateText, {
        model: google("gemini-2.5-flash"),
        prompt: question,
      }),
      step.ai.wrap("ask-anthropic", generateText, {
        model: anthropic("claude-sonnet-4-6"),
        prompt: question,
      }),
    ]);

    return { question, results: [openaiResult, geminiResult, anthropicResult] };
  },
);
