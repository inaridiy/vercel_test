<template>
  <nav class="bg-white shadow-lg z-10">
    <div class="flex items-center justify-between py-2 px-8 md:px-12">
      <div class="flex justify-between items-center">
        <div class="text-2xl font-bold text-gray-800 md:text-3xl">
          <nuxt-link to="/">{{ info.siteName }}</nuxt-link>
        </div>
      </div>
      <div class="flex -mx-2">
        <div>
          <nuxt-link
            to="/"
            exact-active-class="border-b-4 border-gray-800 "
            class="text-gray-800 rounded-t hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2"
            >Home</nuxt-link
          >
        </div>
        <div v-for="menu of info.naviMenu" :key="menu.text">
          <nuxt-link
            :to="menu.to || `/`"
            active-class="border-b-4 border-gray-800 "
            class="text-gray-800 rounded-t hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2"
            >{{ menu.text }}</nuxt-link
          >
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({ menuOpen: false }),
  computed: {
    ...mapGetters({
      info: 'info/info',
    }),
  },
}
</script>
