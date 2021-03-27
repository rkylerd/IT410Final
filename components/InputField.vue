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
      v-model="inputVal"
      :state="state"
      trim
    ></b-form-input>
  </b-form-group>
</template>

<script>
export default {
  computed: {
    state() {
      return !this.watchInvalid || this.name.length > 0
    },
    invalid() {
      return this.hint
    },
    inputVal: {
      get() {
        return this.value
      },
      set(val) {
        !this.watchInvalid && (this.watchInvalid = true)
        this.$emit('changed', val)
      },
    },
  },
  data() {
    return {
      watchInvalid: false,
    }
  },
  props: {
    name: {
      type: String,
    },
    value: {
      type: String,
    },
    labelName: {
      type: String,
    },
    hint: {
      type: String,
    },
  },
}
</script>

<style>
</style>