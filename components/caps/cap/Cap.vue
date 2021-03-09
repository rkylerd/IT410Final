<template>
  <div class="cap-item">
    <client-only placeholder="Loading...">
    <vue-flip  height="300px" width="250px" :active-click="true">
      <template v-slot:front>
        <Front :cap="cap" />
      </template>
      <template v-slot:back>
        <Back :cap="cap" />
      </template>
    </vue-flip>
    </client-only>
    <Bottom :cap="cap" />
  </div>
</template>

<script>
import Front from './Front';
import Back from './Back';
import Bottom from './Bottom';

export default {
  props: {
    cap: Object,
  },
  components: {
    Front,
    Back,
    Bottom,
  },
  methods: {},
};
</script>


<style scoped>

.cap-item {
    box-shadow: 0 10px 5px #888888;
    margin: 4rem 4rem;
}

</style>