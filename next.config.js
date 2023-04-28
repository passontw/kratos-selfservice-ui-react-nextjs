/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    ORY_PAT: process.env.ORY_PAT,
    ORY_SDK_URL: process.env.ORY_SDK_URL,
    HYDRA_ADMIN_URL: process.env.HYDRA_ADMIN_URL,
    ORY_CUSTOM_DOMAIN: process.env.ORY_CUSTOM_DOMAIN,
    NEXT_PUBLIC_REDIRECT_URI: process.env.NEXT_PUBLIC_REDIRECT_URI,
  },
  typescript: { 
    ignoreBuildErrors: true,
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  }
}
