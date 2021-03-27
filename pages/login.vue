<template>
  <div>
    <section>
      <form @keyup.enter="login">
        <h1>Login</h1>
        <input-field
          name="username"
          :value="this.username"
          labelName="Username"
          :hint="inputValidation"
          @changed="
            (uname) => {
              this.username = uname
            }
          "
        />
        <input-field
          name="password"
          :value="password"
          labelName="Password"
          :hint="inputValidation"
          @changed="
            (password) => {
              this.password = password
            }
          "
        />
        <b-row class="error">
          <span v-if="error">{{ error }}</span>
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
import InputField from '../components/InputField.vue'
export default {
  components: { InputField },
  data() {
    return {
      username: '',
      password: '',
      inputValidation: '*Required field',
      error: '',
    }
  },
  methods: {
    async login() {
      try {
        const user = {
          username: this.username,
          password: this.password,
        }

        const {
          headers: { authorization: auth = 'Bearer ' } = {},
        } = await this.$axios.put('/api/user/login', user)

        const jwt = auth.split(' ')[1] || ''
        if (jwt) {
          this.$store.dispatch('setAuth', jwt)
          this.$store.dispatch('setUser', user)
          this.$router.push({ path: '/' })
        }
      } catch (err) {
        const {
          message = 'Invalid credentials.ddd Try again.',
        } = err.response.data
        this.error = message
      }
    },
  },
}
</script>

<style>
section form {
  max-width: 400px;
  margin: 10px auto;
  padding: 20px;
  border-radius: 5px;
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 2px 2px 10px 5px #2121;
}

section form h1 {
  text-align: center;
}

div.row {
  margin: 0;
  justify-content: flex-end;
}

div.row.error {
  justify-content: center;
  color: #dc3545;
  font-size: 13px;
  min-height: 30px;
  vertical-align: middle;
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