<template>
  <main class="bg-gray-100">
    <div class="md:flex xl:w-3/4 m-auto">
      <div class="w-full md:w-2/3 lg:w-3/4">
        <SideItem>
          <article class="m-4 lg:m-2">
            <section class="pb-4">
              <h1 class="text-4xl font-bold">{{ article.title }}</h1>
              <div class="m-2">
                <fa icon="history" class="mr-2" />{{ getData }}
              </div>
              <div class="m-2">
                <fa icon="tags" class="mr-2" />
                <Tags v-for="tag of article.tags" :key="tag">{{ tag }}</Tags>
              </div>
              <nuxt-img :src="`/images/${article.ogpImageName}`" />
            </section>

            <NuxtContent class="prose-lg" :document="article" />
          </article>
          <div
            v-if="prev || next"
            class="grid grid-cols-2 gap-2 text-xl font-bold lg:px-8 p-4 border-t dark:border-gray-800"
          >
            <NuxtLink
              v-if="prev"
              :to="`/articles/${prev.slug}`"
              class="hover:underline flex items-center justify-start"
            >
              <fa icon="arrow-left" />
              <span class="truncate">{{ prev.title }}</span>
            </NuxtLink>

            <NuxtLink
              v-if="next"
              :to="`/articles/${next.slug}`"
              class="hover:underline flex items-center justify-end"
            >
              <span class="truncate">{{ next.title }}</span>
              <fa icon="arrow-right" />
            </NuxtLink>
          </div>
        </SideItem>
      </div>
      <div
        class="fixed h-full bg-white top-0 right-0 border-2 w-full sm:w-2/3 md:w-1/3 lg:w-1/4 md:block md:static md:h-auto md:bg-gray-100 md:border-0"
        :class="{ block: openSideMenu, hidden: !openSideMenu }"
      >
        <div class="md:sticky md:top-0">
          <AppSearch class="m-4" />
          <AppMember v-if="member" :member="member" />
          <AppTableOfContents :article="article" />
        </div>
      </div>
    </div>
    <button
      class="md:hidden bg-white fixed rounded-full h-16 w-16 bottom-10 right-10 border-2 flex items-center justify-center"
      @click="openSideMenu = !openSideMenu"
    >
      <fa v-if="openSideMenu" icon="times" class="leading-10 text-3xl" />
      <fa v-else icon="bars" class="leading-10 text-3xl" />
    </button>
  </main>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    const article = await $content('articles', params.article_Id).fetch()

    const member = (await $content('members').fetch()).find(
      (mem) => mem.name === article.contributor
    )

    const [prev, next] = await $content('articles')
      .only(['title', 'slug'])
      .sortBy('createdAt', 'asc')
      .surround(params.article_Id)
      .fetch()

    return {
      article,
      member,
      prev,
      next,
    }
  },
  data: () => ({
    openSideMenu: false,
  }),
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `${this.article.descriptions}...`,
        },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:title', property: 'og:title', content: this.article.title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: `${this.article.descriptions || ''}...`,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${this.$config.baseURL}${this.$router.history.base}${this.$route.path}`,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${this.$config.baseURL}/images/${this.article.ogpImageName}`,
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image',
        },
      ],
    }
  },
  computed: {
    getData() {
      const date = new Date(this.article.updatedAt)
      const dateFormatted = date.toLocaleDateString('ja-JP')
      return dateFormatted
    },
  },
}
</script>
