<template>
    <div class="height">
        <div class="main-container">
        <h3 class="title">Items in Your Cart</h3>
        <hr>
        <cart-list />
    </div>
    </div>
</template>

<script>

import CartList from '../../components/cart-comp/CartList';
export default {
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
    padding: 1rem 1rem;
}

.height {
    min-height: 100vh;
}

</style>