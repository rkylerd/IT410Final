<template>
    <div>
        <div v-if="cart.length > 0">
            <div>
                <cart-item v-for="item in cart" :key="item.item.name" :item="item" />
            </div>

            <div class="price-container">
                <div class="price-info">
                    <p>Total: ${{evalTotal()}}</p>
                    <p>Number of Items: {{cart.length}}</p>
                </div>
                <nuxt-link to="/checkout">
                    <b-btn class="button" variant="outline-primary">Checkout</b-btn>
                </nuxt-link>
            </div>
        </div>
        <div v-else>
            <p>Nothing in your cart</p>
        </div>
    </div>
</template>


<script>
import CartItem from './CartItem';
export default {
    components: {
        CartItem,
    },
    computed: {
        cart() {
            return this.$store.getters['cart'];
        }
    },
    methods: {
        evalTotal() {
            let total= 0;
            for (let i = 0; i < this.cart.length; i++) {
                if (this.cart[i].item.promotionalFlag == true) {
                    total += (this.cart[i].item.promotionalPrice * this.cart[i].qty);
                } else {
                    total += (this.cart[i].item.price * this.cart[i].qty);
                }
            }
            return total.toFixed(2);
        }
    }
}
</script>


<style scoped>

.price-container {
    display: flex;
    justify-content: flex-end;
}

.price-info p {
    margin: 0;
}

.button {
    margin: 0 1rem;
}

</style>