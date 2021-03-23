<template>
  <div>
    <section>
      <form>
        <h1>Sign Up</h1>
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
          :name="email"
          labelName="Email"
          :watchInvalid="emailAttempted"
          :hint="inputValidation"
          @changed="
            (email) => {
              !this.emailAttempted && (this.emailAttempted = true)
              this.email = email
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
        <input-field
          :name="fName"
          labelName="First Name"
          :watchInvalid="fNameAttempted"
          :hint="inputValidation"
          @changed="
            (fName) => {
              !this.fNameAttempted && (this.fNameAttempted = true)
              this.fName = fName
            }
          "
        />
        <input-field
          :name="lName"
          labelName="Last Name"
          :watchInvalid="lNameAttempted"
          :hint="inputValidation"
          @changed="
            (lName) => {
              !this.lNameAttempted && (this.lNameAttempted = true)
              this.lName = lName
            }
          "
        />
        <b-row class="error">
          <span v-if="error">{{ error }}</span>
        </b-row>
        <b-row>
          <b-button variant="outline-primary" id="login" @click="signup"
            >Sign Up</b-button
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
      emailAttempted: false,
      fNameAttempted: false,
      lNameAttempted: false,
      username: '',
      email: '',
      password: '',
      fName: '',
      lName: '',
      inputValidation: '*Required field',
      error: '',
    }
  },
  methods: {
    async signup() {
      try {
        const user = {
          username: this.username,
          email: this.email,
          fName: this.fName,
          lName: this.lName,
        }

        const {
          headers: { authorization: auth = 'Bearer ' } = {},
        } = await this.$axios.post('/api/user', {
          ...user,
          password: this.password,
        })

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