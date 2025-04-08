import { promises as fs } from 'node:fs';
import fg from 'fast-glob';
import matter from 'gray-matter';
import path from 'node:path';
import { baseUrl } from '@/lib/metadata';

export const revalidate = false;

function removeExtension(filePath: string) {
  return path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)));
}

export async function GET() {
  const url = (path: string): string => new URL(path, baseUrl).toString();

  const files = await fg([
    './content/docs/**/*.mdx',
    '!./content/docs/api/reference/**/*',
  ]);

  type DocEntry = { title: string; description: string; file: string };
  const groupedDocs: Record<string, DocEntry[]> = {};

  const categoryMapping: Record<string, string> = {
    api: 'MeetingBaas API',
    'transcript-seeker': 'Transcript Seeker',
    'speaking-bots': 'Speaking Bots',
  };

  for (const file of files) {
    const fileContent = await fs.readFile(file, 'utf8');
    const { data } = matter(fileContent);
    const dir = path.dirname(file).split(path.sep).at(3) ?? '';

    const category = categoryMapping[dir] ?? 'Others';

    if (!groupedDocs[category]) groupedDocs[category] = [];
    groupedDocs[category].push({
      title: data.title || 'Untitled',
      description: data.description || `More information about ${category}'s ${data.title || 'Untitled'}`,
      file,
    });
  }

  let markdownOutput = '# Docs\n\n';

  Object.entries(groupedDocs).forEach(([category, docs]) => {
    markdownOutput += `## ${category}\n\n`;
    docs.forEach(({ title, description, file }) => {
      const docUrl = url(removeExtension(file.replace('./content/docs/', '')));
      markdownOutput += `- [${title}](${docUrl}): ${description}\n`;
    });
    markdownOutput += '\n';
  });

  return new Response(markdownOutput, {
    headers: { 'Content-Type': 'text/markdown' },
  });
}
