<template>
  <div class="container">
    <div>
      <Banner />
      <cap-list />
    </div>
  </div>
</template>

<script>
import CapList from '../components/caps/CapList.vue'
import Banner from '../components/shared/Banner'
export default {
  // async asyncData({ params, $http }) {
  //   const post = await $http.$get(`https://api.nuxtjs.dev/posts/${params.id}`)
  //   return { post }
  // }
  components: {
    CapList,
    Banner,
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
