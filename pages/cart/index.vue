<template>
    <div class="main-container">
        <h3 class="title">Items in Your Cart</h3>
        <hr>
        <cart-list />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import CartList from '../../components/cart-comp/CartList';
export default {
    computed: mapState([
    'cart'
  ]),
  components: {
      CartList,
  },
}
</script>


<style scoped>

.main-container {
    width: 90%;
    margin: 5rem auto;
    box-shadow: 0 10px 5px #888888;
    min-height: 30rem;
    padding: 1rem 1rem;
}

</style>