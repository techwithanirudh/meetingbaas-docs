import { generateDocs } from './generate-docs.mjs';

async function main() {
  await Promise.all([generateDocs()]);
}

await main().catch((e) => {
  console.error('Failed to run pre build script', e);
});
