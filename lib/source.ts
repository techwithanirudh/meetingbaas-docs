import type { InferMetaType, InferPageType } from 'fumadocs-core/source';
import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { attachFile, createOpenAPI } from 'fumadocs-openapi/server';
import { createElement } from 'react';
import { docs } from '@/.source';

export const source = loader({
  baseUrl: '/docs',
  icon(icon) {
    if (icon && icon in icons)
      return createElement(icons[icon as keyof typeof icons]);
  },
  source: docs.toFumadocsSource(),
  pageTree: {
    attachFile,
  },
});

export const openapi = createOpenAPI({
  proxyUrl: 'https://proxy.meetingbaas.com/api/',
  shikiOptions: {
    themes: {
      dark: 'vesper',
      light: 'vitesse-light',
    },
  },
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;