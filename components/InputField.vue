<template>
  <b-form-group
    :id="`${name}-1`"
    :label="`${labelName}`"
    :label-for="name"
    :invalid-feedback="invalid"
    :state="isValid"
  >
    <b-form-input
      :id="name"
      v-model="inputVal"
      :state="isValid"
      :type="
        type !== 'password' ? type : showPassword === 'Hide' ? 'text' : type
      "
      @focus="
        !watchInvalid &&
          type === 'password' &&
          autoPopulatePassword &&
          (inputVal = '')
      "
      @blur="inputVal = inputVal"
      trim
    ></b-form-input>
    <b-form-checkbox
      id="password-toggle"
      v-if="type === 'password'"
      v-model="showPassword"
      name="password-toggle"
      value="Hide"
      unchecked-value="Show"
    >
      Show Password
    </b-form-checkbox>
  </b-form-group>
</template>

<script>
export default {
  computed: {
    isValid() {
      return !this.required || !this.watchInvalid || this.value.length > 0
    },
    invalid() {
      return this.hint
    },
    inputVal: {
      get() {
        return !this.watchInvalid &&
          this.type === 'password' &&
          this.autoPopulatePassword
          ? 'hidden-password'
          : this.value
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
      showPassword: 'Show',
    }
  },
  props: {
    name: {
      type: String,
      default: 'name',
    },
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    autoPopulatePassword: {
      type: Boolean,
      default: false,
    },
    labelName: {
      type: String,
      default: 'Label',
    },
    hint: {
      type: String,
      default: '*Required Input',
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style>
/* .form-group {
  min-height: 95px;
} */
</style>