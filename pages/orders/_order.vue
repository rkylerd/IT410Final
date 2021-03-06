<template>
  <h1>{{ this.order }}</h1>
</template>

<script>
  export default {
    async asyncData({ params }) {
      const order = params.order 
      return { order }
    }
  }
</script>