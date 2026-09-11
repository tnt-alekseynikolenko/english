import { Injectable } from "@nestjs/common";
import { WORD_TRANSLATION_SYSTEM_PROMPT } from './prompts/word-translation.prompt';
import OpenAI from 'openai';
import { TestWord } from "../tests/types/test-word.type";
import { SENTENCE_GENERATION_SYSTEM_PROMPT } from "./prompts/sentence-generate.propmts";
import { WORD_COLLOCATION_SYSTEM_PROMPT } from "./prompts/word-collocation.prompts";

@Injectable()
export class AiService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async translateWord(word: string) {
    const response = await this.client.chat.completions.create({
      model: 'gpt-5.4-mini',
      messages: [
        {
          role: 'system',
          content: WORD_TRANSLATION_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: word,
        },
      ],
    });
    return response.choices[0].message.content;
  }

  /*
  Input:
{
  "word": "apple",
  "language": "en",
  "pos": "noun",
  "level": "A1",
  "sentenceType": "affirmative"
}
  */

  getRandomLevel(): "A1" | "A2" {
    const types = ["A1", "A2"] as const;
    return types[Math.floor(Math.random() * types.length)];
  }

  getRandomSentenceType(): "affirmative" | "negative" | "question" | "random" {
    const types = ["affirmative", "negative", "question", "random"] as const;
    return types[Math.floor(Math.random() * types.length)];
  }

  async generateSentence(word: TestWord) {
    const request = {
      word: word.word,
      language: word.lang_word,
      pos: word.pos,
      level: this.getRandomLevel(),
      sentenceType: this.getRandomSentenceType(),
    };

    const response = await this.client.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [
        {
          role: 'system',
          content: SENTENCE_GENERATION_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: JSON.stringify(request),
        },
      ],
    });

    return response.choices[0].message.content;
  }

  async generatePhrase(word: TestWord) {
    const request = {
      "word": word.word
    };

    const response = await this.client.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [
        {
          role: 'system',
          content: WORD_COLLOCATION_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: JSON.stringify(request),
        },
      ],
    });

    return response.choices[0].message.content;
  }
}

