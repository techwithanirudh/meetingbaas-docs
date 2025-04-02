import { createMetadata } from '@/lib/metadata';
import { metadataImage } from '@/lib/metadata-image';
import { openapi, source } from '@/lib/source';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';

const mdxComponents = {
  ...defaultMdxComponents,
  APIPage: openapi.APIPage,
};

type PageProps = {
  params: { slug: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ params }: PageProps) {
  const slugs = params.slug || [];
  const page = source.getPage(slugs);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        style: 'clerk',
        single: false,
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      {page.data.description && /[#*`\[\]]/g.test(page.data.description) ? (
        <DocsBody>
          <MDXRemote
            source={page.data.description}
            components={mdxComponents}
          />
        </DocsBody>
      ) : (
        <DocsDescription>{page.data.description}</DocsDescription>
      )}
      <DocsBody>
        <MDX components={mdxComponents} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: PageProps) {
  const slugs = params.slug || [];
  const page = source.getPage(slugs);
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
