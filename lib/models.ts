import { customProvider } from "ai";
import { openai } from "@ai-sdk/openai";

export const myProvider = customProvider({
  languageModels: {
    "gpt-4o-mini": openai("gpt-4o-mini"),
  },
});

interface Model {
  id: string;
  name: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: "gpt-4o-mini",
    name: "GPT 4o mini",
    description:
      "Claude 3.7 Sonnet is Anthropic's most intelligent model to date and the first Claude model to offer extended thinking – the ability to solve complex problems with careful, step-by-step reasoning.",
  }
];