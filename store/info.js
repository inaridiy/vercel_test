export const state = () => ({
  siteName: 'プロキオン',
  naviMenu: [{ text: 'Blog', to: '/articles' }],
  home: {
    title: '僕らは抵抗するで<span class="text-indigo-600">技術で</span>',
    text: `好きなもの作り続ければ自ずと道が見える...
  かもしれない。不透明な未来では明日のことも分からない。
  けどせめて自分の技術は信じたい。`,
    images: ['/images/minecraft.jpg'],
  },
})

export const getters = { info: (state) => state }
