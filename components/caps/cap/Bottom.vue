<template>
    <div>
        <div>
            <b-form-select v-model="selected" :options="options"></b-form-select>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selected: null,
            options: [
                {
                    value: null, text: 'select size'
                },
                {
                    value: 'small', text: 'small'
                },
                {
                    value: 'medium', text: 'medium'
                },
                {
                    value: 'large', text: 'large'
                }
            ],
        }
    }
}
</script>
