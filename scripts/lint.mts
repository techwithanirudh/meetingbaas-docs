import { getTableOfContents } from "fumadocs-core/server";
import { getSlugs, parseFilePath } from "fumadocs-core/source";
import {
  printErrors,
  readFiles,
  scanURLs,
  validateFiles,
} from "next-validate-link";
import path from "node:path";

// Normalize paths to match the actual file structure
function normalizePath(filePath: string): string {
  // Remove content/ prefix if present
  filePath = filePath.replace(/^content\//, "");

  // Handle api-reference vs api/reference paths
  if (filePath.startsWith("api-reference/")) {
    filePath = filePath.replace("api-reference/", "api/reference/");
  }

  // Remove /docs/ prefix if present
  if (filePath.startsWith("/docs/")) {
    filePath = filePath.slice(6);
  } else if (filePath.startsWith("docs/")) {
    filePath = filePath.slice(5);
  }

  // Remove leading slash if present
  if (filePath.startsWith("/")) {
    filePath = filePath.slice(1);
  }

  // Remove .mdx extension if present
  if (filePath.endsWith(".mdx")) {
    filePath = filePath.slice(0, -4);
  }

  return filePath;
}

async function checkLinks() {
  // Read all documentation files
  const docsFiles = await readFiles("content/**/*.mdx");

  // Create a map of all valid paths
  const validPaths = new Set(
    docsFiles.map((file) => {
      const normalized = normalizePath(file.path);
      return normalized;
    })
  );

  // Normalize all file paths
  const normalizedFiles = docsFiles.map((file) => ({
    ...file,
    path: file.path,
    normalizedPath: normalizePath(file.path),
  }));

  const scanned = await scanURLs({
    populate: {
      "docs/[[...slug]]": normalizedFiles.map((file) => {
        const info = parseFilePath(path.relative("content", file.path));
        return {
          value: getSlugs(info),
          hashes: getTableOfContents(file.content).map((item) =>
            item.url.slice(1)
          ),
        };
      }),
    },
  });

  // Custom validation to check if links exist
  const errors = [];
  for (const file of normalizedFiles) {
    const content = file.content;
    const matches = content.match(/\[.*?\]\((\/docs\/[^)]+)\)/g) || [];

    for (const match of matches) {
      const linkMatch = match.match(/\[.*?\]\((\/docs\/[^)]+)\)/);
      if (linkMatch) {
        const link = linkMatch[1];
        const normalizedLink = normalizePath(link);

        if (!validPaths.has(normalizedLink)) {
          const lineNumber =
            content.split("\n").findIndex((line) => line.includes(link)) + 1;
          errors.push({
            file: file.path,
            message: `Invalid link: ${link} -> ${normalizedLink}`,
            line: lineNumber,
          });
        }
      }
    }
  }

  // Print custom validation errors
  if (errors.length > 0) {
    console.log("\nCustom validation errors:");
    for (const error of errors) {
      console.log(`${error.file}:${error.line} - ${error.message}`);
    }
    process.exit(1);
  }

  printErrors(
    await validateFiles(normalizedFiles, {
      scanned,
    }),
    true
  );
}

void checkLinks();
