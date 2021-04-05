<template>
  <div class="main-container">
    <div class="item-content">
      <div class="img-container">
        <img :src="getHatPic(item.imageUrl)" alt="" class="item-img" />
        <div class="text-container">
          <p class="item-text">{{ item.name }}</p>
          <p class="item-text">{{ item.size }}</p>
        </div>
      </div>
      <div class="price-container">
        <div class="item-info">
          <p>${{ evalPrice(item) }}</p>
          <p>count: {{ item.qty }}</p>
        </div>
        <b-btn variant="danger" @click="remove()">Remove</b-btn>
      </div>
    </div>
    <hr />
  </div>
</template>


<script>
export default {
  props: {
    item: Object,
  },
  methods: {
    getHatPic(pic) {
      return require('~/assets/images/' + pic + '.jpg')
    },
    evalPrice(item) {
      return (
        (item.promotionalFlag ? item.promotionalPrice : item.price) * item.qty
      ).toFixed(2)
    },
    remove() {
      this.$store.dispatch('removeCart', {
        username: this.$store.state.user.username,
        jwt: this.$store.state.jwt,
        itemId: this.item._id,
        size: this.item.size,
      })
    },
  },
}
</script>


<style scoped>
.item-content {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.img-container {
  display: flex;
  align-items: center;
}

.item-img {
  width: 85px;
  height: 85px;
}

.text-container {
  margin-left: 1rem;
}

.item-text {
  color: #1e81b0;
  margin: 0;
}

.item-info {
  font-weight: 700;
  margin-right: 1rem;
}

.item-info p {
  margin: 0;
}

.price-container {
  display: flex;
}
</style>