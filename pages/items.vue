<template>
  <h1>{{ j }}Items page {{ mountains }}</h1>
</template>

<script lang='ts'>
import { defineComponent } from '@nuxtjs/composition-api'

export default {
  setup() {
    return { j: 'jason' }
  },
  async asyncData({ $axios }: any) {
    const mountains = await $axios.$get('api/item')
    return { mountains }
  },
}
</script>

<style>
</style>