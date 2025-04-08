import * as fs from 'node:fs/promises';
import fg from 'fast-glob';
import matter from 'gray-matter';
import path from 'node:path';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import { fileGenerator, remarkDocGen, remarkInstall } from 'fumadocs-docgen';
import remarkStringify from 'remark-stringify';
import remarkMdx from 'remark-mdx';
import { remarkAutoTypeTable } from 'fumadocs-typescript';
import { remarkInclude } from 'fumadocs-mdx/config';

export const revalidate = false;

const processor = remark()
  .use(remarkMdx)
  .use(remarkInclude)
  .use(remarkGfm)
  .use(remarkAutoTypeTable)
  .use(remarkDocGen, { generators: [fileGenerator()] })
  .use(remarkInstall, { persist: { id: 'package-manager' } })
  .use(remarkStringify);

export async function GET() {
  const files = await fg([
    './content/docs/**/*.mdx',
    '!./content/docs/api/reference/**/*',
  ]);

  const scan = files.map(async (file) => {
    const fileContent = await fs.readFile(file);
    const { content, data } = matter(fileContent.toString());

    const dir = path.dirname(file).split(path.sep).at(3);
    const category = {
      api: 'MeetingBaas API',
      'transcript-seeker':
        'Transcript Seeker',
      'speaking-bots': 'Speaking Bots',
    }[dir ?? ''];

    const processed: unknown = await processor.process({
      path: file,
      value: content,
    });
    return `file: ${file}
# ${category}: ${data.title}

${data.description}
        
${processed as string}`;
  });

  const scanned = await Promise.all(scan);

  return new Response(scanned.join('\n\n'));
}
