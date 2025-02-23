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
    'nuxt-nodemailer'
  ],
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
    head: {
      script: [
        {
          src: '/main.js',
        },
        {
          src: 'https://cdn.gtranslate.net/widgets/latest/float.js',
          defer: true
        },
      ]
    }
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
      appAbsoluteUrl: 'financia-growths.com'
    }
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
        accent: '#1d1d1d',
        "base-100": '#9F9F9F',
        info: "#007ed7",
        success: "#009b6f",
        warning: "#eab308",
        error: "#dc2626",
      },
    },
  },

  nodemailer: {
    from: '<service@financia-growths.com>Financial Growths',
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure:false,
    auth: {
      user: '8659a8001@smtp-brevo.com',
      pass:''
    },
  },

});