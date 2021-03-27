<template>
  <div id="template">
    <Header />
    <Nuxt />
    <b-alert
      class="alert-notification"
      :show="showAlert"
      :value="alertMsg"
      :variant="color"
      >{{ alertMsg }}</b-alert
    >
    <Footer />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Header from '../components/shared/Header.vue'
import Footer from '../components/shared/Footer.vue'
export default {
  components: {
    Header,
    Footer,
  },
  computed: mapState(['alertMsg', 'showAlert', 'color']),

  async beforeCreate() {
    const token = localStorage.getItem('token') || ''

    if (token) {
      try {
        const {
          data: { addresses = [], email, username },
        } = await this.$axios.get('/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const user = { username, email, addresses }

        this.$store.dispatch('setUser', user)
        this.$store.dispatch('setAuth', token)
      } catch (err) {
        this.$store.dispatch('setAuth', '')
      }
    }
  },
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

html,
body,
div#__nuxt,
div#__layout {
  height: 100%;
}
div#template {
  min-height: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.alert-notification {
  position: fixed;
  bottom: 5%;
  width: 90%;
  left: 5%;
}
</style>
