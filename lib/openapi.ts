import { createOpenAPI } from "fumadocs-openapi/server";
import schema from "./openapi.json";
console.log("OpenAPI Schema:", schema);

export const openapi = createOpenAPI({
  definition: schema,
  defaultLayout: {
    parameters: true,
    body: true,
    response: true,
  },
});
