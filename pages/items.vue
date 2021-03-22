<template>
  <div>
    <div class="cap">
      <Cap v-for="cap in items" :key="cap.id" :cap="cap" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Caps from '../components/caps/CapList.vue'
export default {
  data() {
    return {}
  },
  components: {
    Caps,
  },
  watchQuery: true,
  async asyncData({ $axios, store, route: { query: { type = '' } = {} } }) {
    try {
      const {
        headers: { authorization: auth = 'Bearer ' } = {},
      } = await $axios.put('/api/user/login', {
        username: 'admin',
        password: 'admin',
      })

      const jwt = auth.split(' ')[1] || ''
      store.dispatch('setAuth', jwt)

      const { data: items = [] } = await $axios.get(
        `/api/item${type ? `?category=${type}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )

      return { items }
    } catch (err) {
      console.log('error', err)
    }
  },
  computed: mapState(['jwt']),
}
</script>

<style>
</style>