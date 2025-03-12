import { NextResponse } from "next/server";
import { source } from "@/lib/source";
import type { OramaDocument } from "fumadocs-core/search/orama-cloud";

export const revalidate = false;

export async function GET(props: { params: Promise<{ lang: string }>; }): Promise<Response> {
  const params = await props.params;
  const pages = source.getPages(params.lang);
  const results = await Promise.all(
    pages.map(async (page) => {
      const { structuredData } = page.data;

      return {
        id: page.url,
        structured: structuredData,
        tag: page.slugs[0],
        url: page.url,
        title: page.data.title,
        description: page.data.description,
      } satisfies OramaDocument;
    })
  );

  return NextResponse.json(results);
}
