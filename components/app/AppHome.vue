<template>
  <div class="flex bg-white" style="height: 600px">
    <div
      class="flex items-center text-center lg:text-left px-8 md:px-12 lg:w-1/2 relative"
    >
      <div>
        <!-- eslint-disable vue/no-v-html -->
        <h2 class="text-3xl font-semibold text-gray-800 md:text-4xl">
          僕らは抵抗するで<span class="text-indigo-600">技術で</span>
        </h2>
        <!-- eslint-enable -->
        <p class="mt-2 text-sm text-gray-500 md:text-base">
          {{ info.home.text }}
        </p>
        <div class="flex justify-center lg:justify-start mt-6">
          <NuxtLink
            class="px-4 py-3 bg-gray-900 text-gray-200 text-xs font-semibold rounded hover:bg-gray-800"
            to="#"
            >活動内容</NuxtLink
          >
          <NuxtLink
            class="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400"
            to="/articles"
            >ブログ</NuxtLink
          >
        </div>
      </div>
    </div>
    <div
      class="hidden lg:block lg:w-1/2"
      style="clip-path: polygon(10% 0, 100% 0%, 100% 100%, 0 100%)"
    >
      <nuxt-img
        :src="getPicture"
        class="h-full bg-black opacity-75 object-cover"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({ menuOpen: false }),
  computed: {
    ...mapGetters({
      info: 'info/info',
    }),
    getPicture() {
      return this.info.home.images[
        Math.floor(Math.random() * this.info.home.images.length)
      ]
    },
  },
}
</script>
