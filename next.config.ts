import type { NextConfig } from "next";
import createMDX from '@next/mdx';

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'daisy-the-dinosaur';

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
})

const nextConfig: NextConfig = {
  /* config options here */
  //reactCompiler: true,
  experimental: {

  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
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
  turbopack: {
    rules: {
      '*.txt': {
        loaders: ['raw-loader'],
        as: '*.js',
      }
    }
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = 'inline-source-map';
      config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];
      config.output.sourceMapFilename = "[name].js.map";
    }

    config.module.rules.push({
      test: /\.txt$/,
      use: 'raw-loader',
    });

    config.module.rules.push({
      test: /\.pdf$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default withMDX(nextConfig);
