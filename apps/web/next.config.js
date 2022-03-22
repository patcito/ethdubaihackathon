const withTM = require("next-transpile-modules")([
  "ui",
  "react-globe.gl",
  "globe.gl",
  "three",
]);

module.exports = withTM({
  reactStrictMode: true,
  experimental: { esmExternals: "loose" },
});
