<template>
  <div class="container-main">
    <div>
      <Hero/>
      <h1 class="cap-text">Choose your style of cap.</h1>
      <CapType class="cap-type" />
      <div class="category-container" id="caplist">
          <h3 class="category">Displaying category: {{this.$store.getters['category']}}</h3>
      </div>
      <hr>
      
        <b-form class="search-container" @submit.prevent="search()">
          <b-form-input v-model="searchText" placeholder="baseball, beanies, top-hats"></b-form-input>
          <b-button variant="outline-primary" type="submit">Search</b-button>
        </b-form>
      
      <cap-list />
    </div>
  </div>
</template>

<script>
import CapList from '../components/caps/CapList.vue'
import Hero from '../components/shared/Hero'
import CapType from '../components/shared/CapType'
export default {
  components: {
    CapList,
    Hero,
    CapType,
  },

  data() {
    return {
      searchText: "",
    }
  },

  methods: {
    search() {
      this.$store.commit('setCategory', 'all');
      this.$store.commit('setSearchText', this.searchText);
    }
  }
}
</script>

<style scoped>
.container-main {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
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

.cap-type {
  margin: 2rem 0;
}

.cap-text {
  margin-top: 2rem;
}

.category-container {
  padding-left: 5%;
}

.category {
  text-align: left;
  text-transform: capitalize;
}

.search-container {
  width: 50%;
  padding-left: 5%;
  display: flex;
}

@media only screen and (max-width: 550px) {
  .cap-text {
    font-size: 1.5rem;
  }

  .search-container {
    width: 90%;
    padding-left: 0;
    padding: 0 5%;
    margin: 0 auto;
  }
}

</style>
