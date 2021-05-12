<template>
  <SideItem>
    <h2 class="text-2xl border-b-2 p-1">目次</h2>
    <scrollactive
      highlight-first-item
      active-class="text-blue-500"
      class="p-4"
      tag="ul"
    >
      <li
        v-for="link in article.toc"
        :key="link.id"
        :class="{ toc2: link.depth === 2, toc3: link.depth === 3 }"
      >
        <a
          :href="`#${link.id}`"
          class="scrollactive-item transition-padding ease-in-out duration-300 hover:pl-1"
          :class="{
            'py-2': link.depth === 2,
            'ml-2 pb-2': link.depth === 3,
            'ml-3 pb-2': link.depth === 4,
            'ml-4 pb-2': link.depth === 5,
            'ml-5 pb-2': link.depth === 6,
          }"
        >
          {{ link.text }}
        </a>
      </li>
    </scrollactive>
  </SideItem>
</template>

<script>
export default {
  props: { article: { type: Object, required: true } },
}
</script>
