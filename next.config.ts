import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //reactCompiler: true,
  experimental: {

  },
  output: "export",
  basePath: "",
  compiler: {
    styledComponents: true,
  },
  logging: {
    browserToTerminal: true,
  },
  sassOptions: {
    implementation: 'sass-embedded',
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
