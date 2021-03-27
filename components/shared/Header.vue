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
          <b-nav-form>
            <b-form-input
              size="sm"
              class="mr-sm-2"
              placeholder="Search"
            ></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit"
              >Search</b-button
            >
          </b-nav-form>

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <nuxt-link to="/cart">Cart</nuxt-link>
            <template #button-content>
              <em>User</em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>