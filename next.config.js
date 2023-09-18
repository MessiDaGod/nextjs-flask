/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    // Exclude .node files from bundling
    config.externals = config.externals || [];
    config.externals.push({ canvas: 'commonjs canvas' });

    // Add a rule to load .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    config.module.rules.push({
      test: /\.node/,
      use: 'raw-loader',
    });

    return config;
  },
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/api/:path*'
            : '/api/',
      },
    ];
  },
}

module.exports = nextConfig;