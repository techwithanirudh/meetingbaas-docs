import { createMDXSource } from 'fumadocs-mdx';
import { loader } from 'fumadocs-core/source';
import { attachFile, createOpenAPI } from 'fumadocs-openapi/server';
import { docs, meta } from '@/.source';

import { icons } from "lucide-react";
import { createElement } from "react";

import { i18n } from "./i18n";
import { locales, translations } from "@/lib/languages";

export const source = loader({
  baseUrl: '/docs',
  source: createMDXSource(docs, meta),
  i18n,
  icon(icon) {
    if (icon && icon in icons)
      return createElement(icons[icon as keyof typeof icons]);
  },
  pageTree: {
    attachFile,
  },
});

export const openapi = createOpenAPI({
  proxyUrl: 'https://meetingbaas-api-proxy.vercel.app/api/'
});