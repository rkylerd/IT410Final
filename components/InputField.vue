<template>
  <b-form-group
    :id="`${name}-1`"
    :label="`${labelName}`"
    :label-for="name"
    :invalid-feedback="invalid"
    :state="state"
  >
    <b-form-input
      :id="name"
      v-model="value"
      :state="state"
      @blur="handleChange"
      trim
    ></b-form-input>
  </b-form-group>
</template>

<script>
export default {
  computed: {
    state() {
      return !this.watchInvalid || this.value.length > 0
    },
    invalid() {
      return this.hint
    },
  },
  data() {
    return {
      value: this.name,
    }
  },
  methods: {
    handleChange({ target: { value = '' } = {} } = {}) {
      this.$emit('changed', value)
    },
  },
  props: {
    name: {
      type: String,
    },
    labelName: {
      type: String,
    },
    watchInvalid: {
      type: Boolean,
    },
    hint: {
      type: String,
    },
  },
}
</script>

<style>
</style>