<template>
  <main class="md:flex">
    <div class="flex flex-wrap w-full md:w-2/3 lg:w-3/4">
      <PostCard
        v-for="article in articles"
        :key="article.slug"
        :article="article"
      />
    </div>

    <div
      class="fixed h-full bg-white top-0 right-0 border-2 w-full sm:w-2/3 md:w-1/3 lg:w-1/4 md:block md:static md:h-auto md:border-0 md:border-t-2"
      :class="{ block: openSideMenu, hidden: !openSideMenu }"
    >
      <div class="md:sticky md:top-0">
        <AppSearch class="m-4" />
        <SideItem>
          <h2 class="text-2xl border-b-2 p-1">Tags</h2>
          <div class="m-2">
            <button
              v-for="tag in tags"
              :key="tag"
              class="outline-none"
              @click="getNarrowArticles(tag)"
            >
              <span
                class="inline-block rounded-full bg-black text-xs font-bold px-2 py-1 m-1"
                :class="{
                  'bg-white text-black border-black border-2':
                    narrowTag === tag,
                  'text-white': !(narrowTag === tag),
                }"
                >{{ tag }}</span
              >
            </button>
          </div>
        </SideItem>
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
  async asyncData({ $content }) {
    const articles = await $content('articles').without(['body']).fetch()

    const tags = articles
      .map((ele) => ele.tags)
      .flat()
      .filter((x, i, self) => self.indexOf(x) === i)

    return {
      tags,
      articles,
    }
  },
  data: () => ({
    narrowTag: '',
    openSideMenu: false,
  }),
  methods: {
    async getNarrowArticles(tag) {
      this.narrowTag = tag
      this.articles = await this.$content('articles')
        .where({
          tags: { $contains: tag },
        })
        .fetch()
    },
  },
}
</script>
