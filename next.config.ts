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
  turbopack: {},
  webpack: (config) => {
    config.module.rules.push({
      test: /\.pdf$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;
