<template>
  <div>
    <div class="cap">
      <Cap v-for="cap in caps" :key="cap.id" :cap="cap" />
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import Cap from './cap/Cap'
export default {
  components: {
    Cap,
  },
  
  computed: {
    caps() {
      return this.$store.getters['caps'];
    }
  },
  methods: {
    
  },
  async mounted() {
    await this.$store.dispatch('getItems');
  },
}
</script>


<style scoped>
.cap {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>