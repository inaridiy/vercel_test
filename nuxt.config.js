export default {
  target: 'static',

  head: {
    title: 'プロキオン',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'プロキオンの日常とか開発とか',
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'プロキオン',
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: process.env.BASE_URL },
      { hid: 'og:title', property: 'og:title', content: 'プロキオン' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'プロキオンの日常とか開発とか',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: `${process.env.BASE_URL}/ogp.png`,
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: ['~/assets/css/main.css'],

  plugins: ['@/plugins/vue-scrollactive'],

  components: true,

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxtjs/fontawesome',
    '@/modules/ogp.js',
  ],

  modules: ['@nuxt/content', '@nuxtjs/pwa'],

  content: {
    markdown: {
      prism: {
        theme: 'prism-themes/themes/prism-material-oceanic.css',
      },
    },
  },
  fontawesome: {
    component: 'fa',
    icons: {
      solid: [
        'faTags',
        'faHistory',
        'faBars',
        'faTimes',
        'faArrowRight',
        'faArrowLeft',
        'faSearch',
      ],
      regular: [],
      brands: ['faGithub', 'faTwitter'],
    },
  },
  publicRuntimeConfig: {
    baseURL: process.env.BASE_URL || 'http://locahost:3000',
  },
  manifest: {
    name: 'プロキオン',
    lang: 'ja',
    short_name: 'TeamP',
    title: 'プロキオン',
    'og:title': 'プロキオン',
    description: 'プロキオンの日常とか開発とか',
    'og:description': 'プロキオンの日常とか開発とか',
    theme_color: '#fff',
    background_color: '#fff',
  },
  build: {},
}
