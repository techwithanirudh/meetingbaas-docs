import chokidar from "chokidar";
import * as fs from "fs/promises";
import { generateDocs } from "./generate-docs.mjs";

chokidar.watch("../openapi.json").on("change", async (path) => {
  console.log(`OpenAPI file changed: ${path}`);
  try {
    // Validate JSON first
    const content = await fs.readFile(path, "utf-8");
    JSON.parse(content); // This will throw if JSON is invalid

    await generateDocs();
    console.log("Documentation regenerated successfully");
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("Invalid JSON in OpenAPI file:", error.message);
    } else {
      console.error("Error regenerating documentation:", error);
    }
  }
});

console.log("Watching for OpenAPI changes...");
