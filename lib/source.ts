import { createMDXSource } from 'fumadocs-mdx';
import { loader } from 'fumadocs-core/source';
import { attachFile, createOpenAPI } from 'fumadocs-openapi/server';
import { docs, meta } from '@/.source';

import { icons } from "lucide-react";
import { createElement } from "react";
import { APIPlayground } from 'fumadocs-openapi/scalar';

export const source = loader({
  baseUrl: '/docs',
  source: createMDXSource(docs, meta),
  icon(icon) {
    if (icon && icon in icons)
      return createElement(icons[icon as keyof typeof icons]);
  },
  pageTree: {
    attachFile,
  },
});
 
export const openapi = createOpenAPI({
  renderer: {
    APIPlayground,
  },
});