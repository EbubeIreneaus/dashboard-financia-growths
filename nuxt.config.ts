// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-quasar-ui",
    "nuxt-aos",
    "@nuxt/image",
    "@prisma/nuxt",
    "nuxt-nodemailer",
    "@vite-pwa/nuxt",
  ],
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
    head: {
      script: [
        {
          src: "/main.js",
        },
        {
          src: "https://cdn.gtranslate.net/widgets/latest/float.js",
          defer: true,
        },
      ],
      link: [
        {rel:'manifest', href: '/manifest.json'},
        {rel:'icon', href: '/favicon/favicon.ico'}
      ]
    },
  },

  css: ["~/assets/css/style.css"],

  vite: {
    resolve: {
      alias: {
        ".prisma/client/index-browser":
          "./node_modules/.prisma/client/index-browser.js",
      },
    },
  },

  runtimeConfig: {
    jwt_secret: process.env.JWT_SECRET,
    public: {
      appAbsoluteUrl: "financia-growths.com",
    },
  },

  quasar: {
    plugins: ["Dialog", "Notify"],
    iconSet: "fontawesome-v6",
    extras: {
      fontIcons: ["fontawesome-v6", "material-icons"],
    },
    config: {
      brand: {
        primary: "#121212",
        secondary: "#1199fa",
        accent: "#1d1d1d",
        "base-100": "#9F9F9F",
        info: "#007ed7",
        success: "#009b6f",
        warning: "#eab308",
        error: "#dc2626",
      },
    },
  },

  nodemailer: {
    from: "<service@financia-growths.com>Financial Growths",
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: "8659a8001@smtp-brevo.com",
      pass: "",
    },
  },

  pwa: {
    manifest: {
      start_url: "/",
      display: "standalone",
      theme_color: '#121212',
      background_color: '#ffffff',
      name: "Financial Growths",
      short_name: "Financial Growths",
      orientation: "portrait",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  },
});
