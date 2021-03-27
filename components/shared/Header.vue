<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#">
        <nuxt-link to="/">
          <img src="~/assets/images/icons/cap-logo.png" alt="" />
          CAPS
        </nuxt-link>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item
            ><nuxt-link to="/items?type=baseball"
              >Baseball Caps</nuxt-link
            ></b-nav-item
          >
          <b-nav-item
            ><nuxt-link to="/items?type=beanie">Beanies</nuxt-link></b-nav-item
          >
          <b-nav-item
            ><nuxt-link to="/items?type=fedora">Fedoras</nuxt-link></b-nav-item
          >
          <b-nav-item
            ><nuxt-link to="/items?type=western"
              >Western Hats</nuxt-link
            ></b-nav-item
          >
          <b-nav-item
            ><nuxt-link to="/items?type=top">Top Hats</nuxt-link></b-nav-item
          >
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>User</em>
            </template>
            <template v-if="user.username">
              <b-dropdown-item href="#"
                ><nuxt-link to="/cart">Cart</nuxt-link></b-dropdown-item
              >
              <b-dropdown-item href="/profile">Profile</b-dropdown-item>
              <b-dropdown-item href="#" @click="logout"
                >Sign Out</b-dropdown-item
              >
            </template>
            <template v-else>
              <b-dropdown-item href="/signup">Sign Up</b-dropdown-item>
              <b-dropdown-item href="/login">Sign In</b-dropdown-item>
            </template>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  methods: {
    async logout() {
      try {
        await this.$axios.put(
          `/api/user/${this.$store.state.user.username}/logout`,
          null,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.jwt}`,
            },
          }
        )
        this.$store.dispatch('setAuth', '')
        this.$store.dispatch('setUser', {})
        this.$router.replace('/login')
      } catch (err) {
        console.log(err.response.data)
      }
    },
  },
})
</script>
