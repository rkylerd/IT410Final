<template>
      <div class="accordion" role="tablist">
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.accordion-1 variant="info">Accordion 1</b-button>
      </b-card-header>
      <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <b-card-text>I start opened because <code>visible</code> is <code>true</code></b-card-text>
          <b-card-text>{{ text }}</b-card-text>
          <input-field
            v-for="(field, idx) in fields"
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
        </b-card-body>
      </b-collapse>

    </b-card>

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

  </div>
</template>

<script>
import InputField from '../components/InputField.vue'

export default {
  data() {
    return {
      elements: [],
      fieldsPerElement: [],
    }
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

