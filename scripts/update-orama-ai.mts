import * as fs from "node:fs/promises";
import { CloudManager } from "@oramacloud/client";
import fg from "fast-glob";
import matter from "gray-matter";
import path from "node:path";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import { fileGenerator, remarkDocGen, remarkInstall } from 'fumadocs-docgen';
import remarkStringify from 'remark-stringify';
import remarkMdx from 'remark-mdx';
import { remarkAutoTypeTable } from 'fumadocs-typescript';
import { remarkInclude } from 'fumadocs-mdx/config';

export async function updateOramaAi(): Promise<void> {
  const apiKey = process.env.ORAMA_PRIVATE_API_KEY;
  const index = process.env.ORAMA_AI_INDEX_ID;

  if (!apiKey || !index) {
    console.log("no api key for Orama found, skipping");
    return;
  }

  const manager = new CloudManager({ api_key: apiKey });
  const indexManager = manager.index(index);

  const files = await fg([
    "./content/docs/**/*.mdx",
    '!./content/docs/api/reference/**/*',
  ]);
  const records: unknown[] = [];

  console.log("processing documents for AI");
  const scan = files.map(async (file) => {
    const fileContent = await fs.readFile(file);
    const { content, data } = matter(fileContent.toString());

    const dir = path.dirname(file).split(path.sep).at(3);
    const category = {
      api: "MeetingBaas API, the main purpose of the documentation",
      "transcript-seeker": "Transcript Seeker, the open-source transcription playground",
      "speaking-bots": "Speaking Bots, the Pipecat-powered bots",
    }[dir ?? ""];

    const processed = await processContent(file, content);

    records.push({
      id: file,
      title: data.title as string,
      description: data.description as string,
      content: processed,
      category,
    });
  });

  await Promise.all(scan);

  console.log(`added ${records.length} records`);
  await indexManager.snapshot(records);
  await indexManager.deploy();
}


async function processContent(path: string, content: string): Promise<string> {
  const file = await remark()
    .use(remarkMdx)
    .use(remarkInclude)
    .use(remarkGfm)
    .use(remarkAutoTypeTable)
    .use(remarkDocGen, { generators: [fileGenerator()] })
    .use(remarkInstall, { persist: { id: 'package-manager' } })
    .use(remarkStringify)
    .process({
      path,
      value: content,
    });

  return String(file);
}