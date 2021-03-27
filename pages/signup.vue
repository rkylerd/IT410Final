<template>
  <div>
    <section>
      <form @keyup.enter="signup">
        <h1>Sign Up</h1>

        <input-field
          v-for="(field, idx) in signupFields"
          :key="idx"
          :value="self[field.field]"
          :name="field.field"
          :type="field.type ? field.type : 'text'"
          :labelName="field.label"
          :hint="inputValidation"
          :required="true"
          @changed="
            (value) => {
              self[field.field] = value
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
      username: '',
      email: '',
      password: '',
      fName: '',
      lName: '',
      inputValidation: '*Required field',
      signupFields: [
        { field: 'username', label: 'Username' },
        { field: 'email', label: 'Email' },
        { field: 'password', label: 'Password', type: 'password' },
        { field: 'fName', label: 'First Name' },
        { field: 'lName', label: 'Last Name' },
      ],
      error: '',
      self: this,
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
.form-group {
  margin-bottom: 0;
}

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