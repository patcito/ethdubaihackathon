const withTM = require("next-transpile-modules")([
  "ui",
  "react-globe.gl",
  "globe.gl",
  "three",
]);

module.exports = withTM({
  distDir: "build",
  reactStrictMode: true,
  experimental: { esmExternals: "loose" },
});
