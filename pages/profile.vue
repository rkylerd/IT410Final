<template>
  <div class="page flex">
    <section class="left-nav side">
      <h3>Profile Settings</h3>
      <div
        v-for="(field, idx) in fieldsToUpdate"
        :key="idx"
        @click="
          () => {
            indexOfCurrField = idx
            inputVal = user[field.field]
            isSaveDisabled = true
            // create dynamic vm fields if working with embedded fields (i.e. addresses)
            if ({ ...fieldsToUpdate[idx] }.embeddedFields) {
              ;[...embeddedFields[fieldsToUpdate[idx].field]].forEach(
                (field) => self[{ ...fieldsToUpdate[idx] }.field]
              )
            }
          }
        "
      >
        {{ field.label }}
      </div>
    </section>
    <section class="center">
      <div class="content">
        <input-field
          v-if="!computedEmbeddedField"
          style="min-height: 95px"
          :name="fieldsToUpdate[indexOfCurrField].field"
          :labelName="fieldsToUpdate[indexOfCurrField].label"
          :value="inputVal"
          :type="
            fieldsToUpdate[indexOfCurrField].type
              ? fieldsToUpdate[indexOfCurrField].type
              : 'text'
          "
          @changed="
            (value) => {
              inputVal = value
              toggleIsSaveDisabled()
            }
          "
        >
        </input-field>

        <template v-else>
          <input-field
            v-for="(field, idx) in embeddedFields[computedEmbeddedField]"
            :key="idx"
            :name="field.field"
            :labelName="field.label"
            :value="self[field.field]"
            @changed="
              (value) => {
                self[field.field] = value
                toggleIsSaveDisabled()
              }
            "
          >
          </input-field>
        </template>

        <b-row>
          <b-button
            :disabled="isSaveDisabled"
            variant="outline-primary"
            id="login"
            @click="updateUser"
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
      self: this,
      isSaveDisabled: true,
      value: undefined,
      valueObj: {},
      user: {},
      indexOfCurrField: 0,
      fieldsToUpdate: [
        { field: 'username', label: 'Username' },
        { field: 'email', label: 'Email' },
        { field: 'phone', label: 'Primary Phone Number' },
        { field: 'password', label: 'Password', type: 'password' },
        { field: 'fName', label: 'First Name' },
        { field: 'lName', label: 'Last Name' },
        {
          field: 'addresses',
          label: 'Address List',
          embeddedFields: 'address',
        },
      ],
      embeddedFieldIndex: 0,
      embeddedFields: {
        address: [
          {
            field: 'street1',
            label: `Street Address`,
          },
          {
            field: 'street2',
            label: `Street Address 2`,
          },
          {
            field: 'city',
            label: `City`,
          },
          {
            field: 'state',
            label: `State`,
          },
          {
            field: 'zip',
            label: `Zip Code`,
          },
        ],
      },
    }
  },
  async mounted() {
    await this.getUser()
  },
  methods: {
    toggleIsSaveDisabled() {
      const embeddedFieldKey = this.computedEmbeddedField

      if (embeddedFieldKey) {
        this.isSaveDisabled = Object.values({
          ...this.embeddedFields[embeddedFieldKey],
        }).some(({ field: key }) => {
          return !self[key].value
        })
      } else {
        this.isSaveDisabled = !this.value || !this.value.length
      }
    },
    constructUpdateBody(embeddedField) {
      // if embedded field exists such as addresses,
      // construct a request body object from the vm's dynamic fields created on the fly
      return embeddedField
        ? {
            [this.fieldsToUpdate[this.indexOfCurrField].field]: [
              [...this.embeddedFields[embeddedField]].reduce(
                (acc, { field: next = '' }) => {
                  acc[next] = self[next].value
                  return acc
                },
                {}
              ),
            ],
          }
        : { [this.fieldsToUpdate[this.indexOfCurrField].field]: this.value }
    },
    async updateUser() {
      try {
        const embeddedField = this.fieldsToUpdate[this.indexOfCurrField]
          .embeddedFields
        const updatedField = this.constructUpdateBody(embeddedField)
        const jwt = this.$store.state.jwt

        // perform update
        const resp = await this.$axios.put(
          `/api/user/${this.$store.state.user.username}`,
          updatedField,
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

        this.updateLocalUser(embeddedField, updatedField)
      } catch (err) {
        console.log('error', err)
      }
    },
    updateLocalUser(embeddedField = '', updatedField = {}) {
      // update the local store user
      this.$store.dispatch('setUser', updatedField)

      // update local user for page
      if (embeddedField) {
        const fields = Object.values(updatedField)[0][this.embeddedFieldIndex]
        Object.entries(fields).forEach(([key, value]) => {
          this[key] = value
        })
      } else {
        this.user = { ...this.user, ...updatedField }
      }
    },
    async getUser() {
      try {
        const jwt = this.$store.state.jwt || localStorage.getItem('token') || ''
        if (!jwt) {
          this.$router.replace('/login')
        }
        const {
          data: { addresses = [], ...restOfUser },
        } = await this.$axios.get('/api/user/me', {
          headers: { Authorization: `Bearer ${jwt}` },
        })

        const { street1 = '', street2 = '', city = '', state = '', zip = '' } =
          addresses[0] || {}
        this.street1 = street1
        this.street2 = street2
        this.city = city
        this.state = state
        this.zip = zip
        this.user = restOfUser
      } catch (err) {
        console.log('error', err)
      }
    },
  },
  computed: {
    computedEmbeddedField() {
      return this.fieldsToUpdate[this.indexOfCurrField].embeddedFields
    },
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
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  background-color: rgb(60, 140, 172);
  color: white;
  text-align: center;
  padding: 0.5em 0;
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