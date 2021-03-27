<template>
  <div class="flex">
    <section class="left-nav side">
      <h3>Profile Settings</h3>
      <div
        v-for="(field, idx) in fieldsToUpdate"
        :key="idx"
        @click="
          () => {
            indexOfCurrField = idx
            inputVal = user[field.field]
          }
        "
      >
        {{ field.label }}
      </div>
    </section>
    <section class="center">
      <div class="content">
        <input-field
          :name="fieldsToUpdate[indexOfCurrField].field"
          :labelName="fieldsToUpdate[indexOfCurrField].label"
          :value="inputVal"
          :type="
            fieldsToUpdate[indexOfCurrField].type
              ? fieldsToUpdate[indexOfCurrField].type
              : 'text'
          "
          @changed="(value) => (this.inputVal = value)"
        >
        </input-field>
        <b-row>
          <b-button variant="outline-primary" id="login" @click="updateUser"
            >Save</b-button
          >
        </b-row>
      </div>
    </section>
    <section class="side"></section>
  </div>
</template>

<script>
import Caps from '../components/caps/CapList.vue'
import InputField from '../components/InputField.vue'

export default {
  data() {
    return {
      value: undefined,
      user: {},
      fieldsToUpdate: [
        { field: 'username', label: 'Username' },
        { field: 'email', label: 'Email' },
        { field: 'phone', label: 'Primary Phone Number' },
        { field: 'password', label: 'Password', type: 'password' },
        { field: 'fName', label: 'First Name' },
        { field: 'lName', label: 'Last Name' },
        { field: 'addresses', label: 'Address List' },
      ],
      indexOfCurrField: 0,
    }
  },
  async mounted() {
    await this.getUser()
  },
  methods: {
    async updateUser() {
      try {
        const jwt = this.$store.state.jwt

        // perform update
        const resp = await this.$axios.put(
          `/api/user/${this.$store.state.user.username}`,
          { [this.fieldsToUpdate[this.indexOfCurrField].field]: this.value },
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        )

        // if user updated his/her username, watch for a new JWT
        if (this.fieldsToUpdate[this.indexOfCurrField].field === 'username') {
          const { headers: { authorization: auth = 'Bearer ' } = {} } = resp

          const newJwt = auth.split(' ')[1] || ''
          if (newJwt) {
            this.$store.dispatch('setAuth', newJwt)
          }
        }

        // update the local store user
        this.$store.dispatch('setUser', {
          [this.fieldsToUpdate[this.indexOfCurrField].field]: this.value,
        })
      } catch (err) {
        console.log('error', err.response.data)
      }
    },
    async getUser() {
      try {
        const jwt = this.$store.state.jwt || localStorage.getItem('token') || ''
        if (!jwt) {
          this.$router.replace('/login')
        }
        const { data: user } = await this.$axios.get('/api/user/me', {
          headers: { Authorization: `Bearer ${jwt}` },
        })

        this.user = user
      } catch (err) {
        console.log('error', err.response.data)
        if (err.response.data.status === 401) {
          this.$router.replace('/login')
        }
      }
    },
  },
  computed: {
    inputVal: {
      get() {
        return this.value === undefined
          ? this.$store.state.user[
              this.fieldsToUpdate[this.indexOfCurrField].field
            ]
          : this.value
      },
      set(val) {
        this.value = val
      },
    },
  },
  components: {
    Caps,
    InputField,
  },
}
</script>

<style>
div.flex {
  display: flex;
  flex-wrap: nowrap;
}

section.side {
  width: 20%;
  min-width: 150px;
}
section.center {
  margin: 2em auto;
  padding: 0 1em;
}
section.center div.content {
  min-width: 300px;
}
section.center div.content div.row {
  justify-content: flex-end;
}

section.left-nav {
  height: 100%;
  border-radius: 4px;
  background-color: rgb(223, 219, 219);
  margin-top: 1em;
  color: #343a40;
}

section.left-nav h3 {
  text-align: center;
  /* background-color: darkgray;
  margin: 0;
  padding: 1em 0; */
  padding-bottom: 0.5em;
  margin-bottom: 0;
  border-bottom: 1px solid black;
}
section.left-nav div {
  padding: 10px 5px;
  transition-duration: 0.5s;

  border-bottom: 1px gray solid;
  border-top: none;
  cursor: pointer;
  transition: all 0.4s ease-in-out;
}
section.left-nav div:hover {
  background-color: rgb(60, 140, 172);
  color: white;
}
</style>