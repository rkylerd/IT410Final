<template>
  <div>
    <section>
      <form>
        <b-form-group
          id="fieldset-1"
          label="Username"
          label-for="username-input"
          :invalid-feedback="invalidFeedback"
          :state="unameState"
        >
          <b-form-input
            id="username-input"
            v-model="username"
            :state="unameState"
            trim
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="fieldset-1"
          label="Enter your name"
          label-for="password"
          :invalid-feedback="invalidFeedback"
          :state="passwordState"
        >
          <b-form-input
            id="password"
            v-model="password"
            :state="passwordState"
            trim
          ></b-form-input>
        </b-form-group>
        <b-row class="error">
          <span v-if="error">Invalid credentials. Try again.</span>
        </b-row>
        <b-row>
          <b-button variant="outline-primary" id="login" @click="login"
            >Login</b-button
          >
        </b-row>
      </form>
    </section>
  </div>
</template>

<script>
export default {
  computed: {
    unameState() {
      return !this.loginAttempted || this.username.length > 0
    },
    passwordState() {
      return !this.loginAttempted || this.password.length > 0
    },
    invalidFeedback() {
      return `*Required field`
    },
  },
  data() {
    return {
      loginAttempted: false,
      username: '',
      password: '',
      error: false,
    }
  },
  methods: {
    async login() {
      this.loginAttempted = true
      try {
        const {
          headers: { authorization: auth = 'Bearer ' } = {},
        } = await this.$axios.put('/api/user/login', {
          username: this.username,
          password: this.password,
        })

        const jwt = auth.split(' ')[1] || ''
        if (jwt) {
          this.$store.dispatch('setAuth', jwt)
          this.$router.push({ path: '/' })
        } else {
        }
      } catch (err) {
        this.error = true
      }
    },
  },
}
</script>

<style>
section form {
  max-width: 400px;
  margin: auto;
}

div.row {
  margin: 0;
  justify-content: flex-end;
}

div.row.error {
  justify-content: center;
  color: #dc3545;
  font-size: 13px;
}

#login {
  color: green;
  border-color: green;
}
#login:hover {
  background-color: green;
  color: white;
}
</style>