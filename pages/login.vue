<template>
  <div>
    <section>
      <form>
        <h1>Login</h1>
        <input-field
          :name="username"
          labelName="Username"
          :watchInvalid="usernameAttempted"
          :hint="inputValidation"
          @changed="
            (uname) => {
              !this.usernameAttempted && (this.usernameAttempted = true)
              this.username = uname
            }
          "
        />
        <input-field
          :name="password"
          labelName="Password"
          :watchInvalid="passwordAttempted"
          :hint="inputValidation"
          @changed="
            (password) => {
              !this.passwordAttempted && (this.passwordAttempted = true)
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
      usernameAttempted: false,
      passwordAttempted: false,
      username: '',
      password: '',
      inputValidation: '*Required field',
      error: false,
    }
  },
  methods: {
    async login() {
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