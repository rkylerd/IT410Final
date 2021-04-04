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
          <b-row>
            <b-button
              :disabled="isSaveDisabled"
              variant="outline-primary"
              id="update-user"
              @click="updateUser"
              >Save</b-button
            >
          </b-row>
          <div class="accordion" role="tablist">
            <b-card
              v-for="(element, accordionIdx) in accordionElements"
              :key="accordionIdx"
              no-body
              class="mb-2"
            >
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button
                  block
                  v-b-toggle="`accordion-${accordionIdx}`"
                  variant="info"
                  >{{ Object.values(element)[0] }}</b-button
                >
              </b-card-header>
              <b-collapse
                :id="`accordion-${accordionIdx}`"
                visible
                accordion="my-accordion"
                role="tabpanel"
              >
                <b-card-body>
                  <input-field
                    v-for="(field, idx) in embeddedFields[
                      computedEmbeddedField
                    ]"
                    :key="`${accordionIdx}-${idx}`"
                    :myKey="`${accordionIdx}-${idx}`"
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
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </template>

        <b-row>
          <b-button
            :disabled="isSaveDisabled"
            variant="outline-primary"
            id="update-user"
            @click="updateUser"
            >Save</b-button
          >
        </b-row>
      </div>
    </section>
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
            required: false,
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
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
    }
  },
  async mounted() {
    await this.getUser()
    this.$root.$on('bv::collapse::state', this.watchCollapsed)
  },
  methods: {
    watchCollapsed(collapseId, isJustShown) {
      this.isSaveDisabled = true
      if (!isJustShown || !/^accordion-/i.test(collapseId)) return
      this.embeddedFieldIndex = +collapseId.split('-')[1]

      const embeddedFieldsLength = (
        this.user[this.fieldsToUpdate[this.indexOfCurrField].field] || []
      ).length
      const embeddedField = this.fieldsToUpdate[this.indexOfCurrField]
        .embeddedFields

      if (!embeddedField) return

      if (this.embeddedFieldIndex !== embeddedFieldsLength) {
        const arr = [...this.embeddedFields[embeddedField]]
        arr.forEach(({ field = '' }) => {
          this[field] = this.user.addresses[this.embeddedFieldIndex][field]
        }, {})
      } else {
        this.embeddedFields[embeddedField].forEach(({ field = '' }) => {
          this[field] = ''
        }, {})
      }
    },
    toggleIsSaveDisabled() {
      const embeddedFieldKey = this.computedEmbeddedField
      if (embeddedFieldKey) {
        this.isSaveDisabled = Object.values({
          ...this.embeddedFields[embeddedFieldKey],
        }).some(({ field: key, required = true }) => required && !this[key])
      } else {
        this.isSaveDisabled = !this.value || !this.value.length
      }
    },
    constructUpdateBody(embeddedField) {
      // if embedded field exists such as addresses,
      // construct a request body object from the vm's dynamic fields created on the fly
      if (embeddedField) {
        const updatedField = [...this.embeddedFields[embeddedField]].reduce(
          (acc, { field: next = '' }) => {
            acc[next] = this[next]
            return acc
          },
          {}
        )

        return {
          [this.fieldsToUpdate[this.indexOfCurrField].field]: [
            ...this.user[
              this.fieldsToUpdate[this.indexOfCurrField].field
            ].slice(0, this.embeddedFieldIndex),
            updatedField,
            ...this.user[
              this.fieldsToUpdate[this.indexOfCurrField].field
            ].slice(this.embeddedFieldIndex + 1),
          ],
        }
      } else {
        return {
          [this.fieldsToUpdate[this.indexOfCurrField].field]: this.value,
        }
      }
    },
    async updateUser() {
      try {
        this.isSaveDisabled = true
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
        const embeddedFieldsLength = this.user[
          this.fieldsToUpdate[this.indexOfCurrField].field
        ].length

        // if adding new address (not updating an existing one)
        if (this.embeddedFieldIndex === embeddedFieldsLength) {
          this.user[this.fieldsToUpdate[this.indexOfCurrField].field].push(
            updatedField[this.fieldsToUpdate[this.indexOfCurrField].field][
              this.embeddedFieldIndex
            ]
          )
        }

        Object.entries(
          updatedField[this.fieldsToUpdate[this.indexOfCurrField].field][
            this.embeddedFieldIndex
          ]
        ).forEach(([key, value]) => {
          if (this.embeddedFieldIndex < embeddedFieldsLength) {
            this.user[this.fieldsToUpdate[this.indexOfCurrField].field][
              this.embeddedFieldIndex
            ][key] = value
          }

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
        const { data: user } = await this.$axios.get('/api/user/me', {
          headers: { Authorization: `Bearer ${jwt}` },
        })
        const { addresses = [] } = user

        const { street1 = '', street2 = '', city = '', state = '', zip = '' } =
          addresses[0] || {}
        this.street1 = street1
        this.street2 = street2
        this.city = city
        this.state = state
        this.zip = zip
        this.user = user
      } catch (err) {
        const { status } = err.response.data || {}
        if (status === 401) {
          this.$router.replace('/login')
        }
      }
    },
  },
  computed: {
    accordionElements() {
      return Object.keys(this.user).length
        ? [
            ...this.user[this.fieldsToUpdate[this.indexOfCurrField].field],
            { 'Accordion Text': 'New Address' },
          ]
        : [{ 'Accordion Text': 'New Address' }]
    },
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
  position: fixed;
  top: 3.1em;
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