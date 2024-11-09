import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

// orama rest api
/** @type {import('next').NextConfig} */

const config = {
  // output: "export",
  reactStrictMode: true,
  eslint: {
    // Replaced by root workspace command
    ignoreDuringBuilds: true,
  },
  // serverExternalPackages: ["ts-morph", "typescript"],
  // images: {
  //   unoptimized: true,
  // },
};

export default withMDX(config);
