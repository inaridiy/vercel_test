<template>
  <SideItem class="">
    <h2 class="text-2xl border-b-2 p-1">投稿者</h2>
    <section class="flex items-center mt-2 ml-2">
      <nuxt-img :src="member.icon" class="rounded-full h-16 border-2" />
      <div class="text-xl">
        <h2 class="font-semibold pl-2">{{ member.name }}</h2>
        <div class="ml-2 text-gray-600">
          <a
            v-if="member.twitter"
            :href="member.twitter"
            class="hover:text-blue-500"
            ><fa :icon="['fab', 'twitter']"
          /></a>
          <a v-if="member.github" :href="member.github" class="hover:text-black"
            ><fa :icon="['fab', 'github']"
          /></a>
        </div>
      </div>
    </section>
    <p class="p-2">{{ member.appeal }}</p>
  </SideItem>
</template>

<script>
export default {
  props: { member: { type: Object, required: true } },
}
</script>
