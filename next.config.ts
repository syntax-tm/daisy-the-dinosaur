import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'daisy-the-dinosaur';

const nextConfig: NextConfig = {
  /* config options here */
  //reactCompiler: true,
  experimental: {

  },
  output: "export",
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}` : '',
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
