<template>
  <div class="content">
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
          <nuxt-link to="/cart">
            <div class="icon-cart">
            <img src="~/assets/images/icons/cart.png" alt="">
            <p class="cart-cnt">{{this.$store.getters['cart'].length}}</p>
          </div>
          </nuxt-link>
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
        this.$store.dispatch('setUser', undefined)
        this.$router.replace('/login')
      } catch (err) {
        console.log(err.response.data)
      }
    },
  },
})
</script>


<style scoped>

.content {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 500;
}

.icon-cart {
  background-color: #fff;
  width: fit-content;
  border-radius: 40px;
  padding: .9rem;
  cursor: pointer;
  position: relative;
}

.cart-cnt {
  position: absolute;
  color: #1e81b0;
  top: -4%;
  right: 40%;
  z-index: 200;
  font-weight: 600;
  font-size: 1rem;
}

</style>