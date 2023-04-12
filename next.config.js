/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    ORY_PAT: process.env.ORY_PAT,
  },
  typescript: { 
    ignoreBuildErrors: true,
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  }
}
