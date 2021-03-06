<template>
    <b-container>
        <b-row>
            <b-col>
                Categories
            </b-col>
        </b-row>
    </b-container>
</template>


<script>
import { mapState } from 'vuex'
export default {
    computed: mapState([
    'caps'
  ]),
}
</script>


<style scoped>

</style>