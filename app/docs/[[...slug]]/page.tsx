import type { Metadata } from 'next';
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
  DocsCategory,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import {
  type ComponentProps,
  type FC,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Popup, PopupContent, PopupTrigger } from 'fumadocs-twoslash/ui';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Callout } from 'fumadocs-ui/components/callout';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { createMetadata } from '@/lib/metadata';
import { openapi, source } from '@/lib/source';
import { metadataImage } from '@/lib/metadata-image';
import { Files, File, Folder } from '@/components/fumadocs/files';
import { Mermaid } from '@theguild/remark-mermaid/mermaid';
import type { MDXComponents } from 'mdx/types';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { AutoTypeTable } from 'fumadocs-typescript/ui';
import { createGenerator } from 'fumadocs-typescript';

const generator = createGenerator();

export const revalidate = false;

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<ReactElement> {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  // const path = `content/docs/${page.file.path}`;
  const { body: Mdx, toc, lastModified } = await page.data.load();

  return (
    <DocsPage
      toc={toc}
      lastUpdate={lastModified}
      full={page.data.full}
      tableOfContent={{
        style: 'clerk',
        single: false,
      }}
      // editOnGithub={{
      //   repo: "docs",
      //   owner: "Meeting-Baas",
      //   sha: "main",
      //   path,
      // }}
      article={{
        className: 'max-sm:pb-16',
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody className="text-fd-foreground/80">
        <Mdx
          components={{
            ...defaultMdxComponents,
            ...((await import('lucide-react')) as unknown as MDXComponents),
            Popup,
            PopupContent,
            PopupTrigger,
            Tabs,
            Tab,
            Mermaid,
            TypeTable,
            AutoTypeTable: (props) => (
              <AutoTypeTable generator={generator} {...props} />
            ),
            Accordion,
            Accordions,
            File,
            Folder,
            Files,
            blockquote: Callout as unknown as FC<ComponentProps<'blockquote'>>,
            APIPage: openapi.APIPage,
            DocsCategory: ({ slugs = params.slug }: { slugs?: string[] }) => (
              <DocsCategory page={source.getPage(slugs)!} from={source} />
            )
          }}
        />
        {page.data.index ? <DocsCategory page={page} from={source} /> : null}
      </DocsBody>
    </DocsPage>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const description =
    page.data.description ??
    'Deploy AI for video meetings through a single unified API.';

  return createMetadata(
    metadataImage.withImage(page.slugs, {
      title: page.data.title,
      description,
      openGraph: {
        url: `/docs/${page.slugs.join('/')}`,
      },
    }),
  );
}

export function generateStaticParams() {
  return source.generateParams();
}
