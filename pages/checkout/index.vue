<template>
  <div class="checkout">
    <b-modal id="my-modal" hide-footer>
      <CartList />
    </b-modal>
    <div class="form-content">
      <div class="contact">
        <h3 class="form-label">Contact Info</h3>
        <b-form @submit.prevent="getShipping()">
          <b-form-input
            required
            class="contact-in"
            v-model="fName"
            placeholder="first name"
          ></b-form-input>
          <b-form-input
            required
            class="contact-in"
            v-model="lName"
            placeholder="last name"
          ></b-form-input>
          <b-form-input
            class="contact-in"
            v-model="phone"
            type="tel"
            placeholder="phone"
          ></b-form-input>
          <b-form-input
            required
            class="contact-in"
            v-model="email"
            type="email"
            placeholder="email"
          ></b-form-input>
          <h3 class="form-label">Shipping Address</h3>
          <b-form-radio
            v-for="(address, idx) in computedAddresses"
            :key="`address ${idx}`"
            @change="
              canShip = false
              shippingPrice = 0
            "
            v-model="addressIdx"
            class="contact-in"
            :aria-describedby="`user address ${idx + 1}`"
            :name="`Address ${idx + 1}`"
            :value="idx"
          >
            <div v-if="address.street1">
              <p>
                {{ address.street1
                }}{{ address.street2 ? `, ${address.street2}` : '' }}
              </p>
              <p>{{ address.city }}, {{ address.state }} {{ address.zip }}</p>
            </div></b-form-radio
          >
          <b-form-radio
            v-model="addressIdx"
            @change="
              canShip = false
              shippingPrice = 0
            "
            class="contact-in"
            aria-describedby="New one-time address"
            name="New address"
            :value="computedAddresses.length"
            >Use a one-time address</b-form-radio
          >
          <template v-if="addressIdx === computedAddresses.length">
            <b-form-input
              required
              class="contact-in"
              v-model="street1"
              type="text"
              placeholder="Address Line 1"
            ></b-form-input>
            <b-form-input
              class="contact-in"
              v-model="street2"
              type="text"
              placeholder="Address Line 2"
            ></b-form-input>
            <b-form-input
              required
              class="contact-in"
              v-model="city"
              type="text"
              placeholder="City"
            ></b-form-input>
            <b-form-select
              required
              v-model="state"
              :options="options"
              class="contact-drop"
            ></b-form-select>
            <b-form-input
              required
              class="contact-in"
              v-model="zip"
              type="text"
              placeholder="Zip Code"
            ></b-form-input>
          </template>
          <div class="confirm-shipping">
            <b-button class="btn-submit" type="submit" variant="primary"
              ><template v-if="!loading">Get Shipping Cost</template>
              <div :class="{ loader: loading }"></div
            ></b-button>
          </div>
        </b-form>
      </div>

      <div class="order-info">
        <h3 class="form-label">Your Order</h3>
        <hr />
        <div class="cart-row">
          <div class="cart-icon">
            <p class="cart-cnt">{{ this.$store.getters['cart'].length }}</p>
            <img src="~/assets/images/icons/shopping-cart.png" alt="" />
          </div>
          <b-button v-b-modal.my-modal class="cart-btn" variant="primary"
            >View Cart</b-button
          >
        </div>
        <hr />
        <h4>Subtotal: ${{ evalSub().toFixed(2) }}</h4>
        <hr />
        <h4>Shipping: ${{ parseFloat(shippingPrice).toFixed(2) }}</h4>
        <hr />
        <h4>Total: ${{ getTotal() }}</h4>
        <div class="confirm-shipping">
          <b-button
            :disabled="!canShip"
            @click="submitOrder"
            class="btn-submit"
            type="button"
            variant="primary"
            >Place Order</b-button
          >
        </div>
        <h2 v-if="orderId" class="order-conf">
          <img src="~/assets/images/checkmark.png" alt="checkmark" />Thanks for
          placing an order, {{ fName }}! <br />
          <span>Id: {{ orderId }}</span>
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CartList from '../../components/cart-comp/CartList'
import { states } from './states'

export default {
  components: {
    CartList,
  },
  data() {
    return {
      addressIdx: 0,
      canShip: false,
      loading: false,
      shippingPrice: 0,
      orderId: '',
      fName: '',
      lName: '',
      phone: '',
      email: '',
      street1: '1328 Christley Ln',
      street2: '',
      city: 'Elk Ridge',
      zip: '84651',
      state: null,
      options: states,
    }
  },
  async mounted() {
    await this.getUser()
    await this.getShipping()
  },
  computed: mapState(['user']),
  methods: {
    constructAddress() {
      let street1, street2, city, state, zip

      if (this.addressIdx === this.$store.state.user.addresses.length) {
        if (!this.street1 || !this.city || !this.zip || !this.state) {
          throw new Error('Invalid address')
        }
        street1 = this.street1
        street2 = this.street2
        city = this.city
        state = this.state
        zip = this.zip
      } else {
        const address = this.$store.state.user.addresses[this.addressIdx]

        street1 = address.street1
        street2 = address.street2
        city = address.city
        state = address.state
        zip = address.zip
      }

      return `<Address1>${street1}</Address1><Address2>${street2}</Address2><City>${city}</City><State>${state}</State><Zip5>${zip}</Zip5>`
    },
    getShipping() {
      if (this.computedAddresses.length === 0) return

      this.loading = true
      let shippingAddress = ''
      try {
        shippingAddress = this.constructAddress()
      } catch (err) {
        this.$store.dispatch('setAlert', {
          alertMsg: 'Shipping address must be complete.',
          showAlert: 4000,
          color: 'warning',
        })
        return
      }

      let url = `https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=<AddressValidateRequest USERID="842BRIGH3285"><Address>${shippingAddress}<Zip4></Zip4></Address></AddressValidateRequest>`
      fetch(url)
        .then((response) => response.text())
        .then((data) => {
          const parser = new DOMParser()
          const xml = parser.parseFromString(data, 'application/xml')
          this.loading = false
          let error = xml.getElementsByTagName('Error')
          if (error.length != 0) {
            this.canShip = false
            this.$store.dispatch('setAlert', {
              alertMsg: 'Not a valid address.',
              showAlert: 5000,
              color: 'warning',
            })
          } else {
            this.canShip = true
          }
        })
        .catch((error) => {
          this.loading = false
          this.canShip = false
          this.$store.dispatch('setAlert', {
            alertMsg: 'Not a valid address.',
            showAlert: 5000,
            color: 'warning',
          })
        })
    },
    evalSub() {
      let cart = this.$store.getters['cart']
      let total = 0
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].promotionalFlag) {
          total += cart[i].promotionalPrice * cart[i].qty
        } else {
          total += cart[i].price * cart[i].qty
        }
      }
      return total
    },
    getTotal() {
      let sub = this.evalSub()
      return (parseFloat(sub) + parseFloat(this.shippingPrice)).toFixed(2)
    },
    async getUser() {
      try {
        const jwt = this.$store.state.jwt || localStorage.getItem('token') || ''
        if (!jwt) {
          return
        }
        const {
          data: { fName = '', lName = '', phone = '', email = '' },
        } = await this.$axios.get('/api/user/me', {
          headers: { Authorization: `Bearer ${jwt}` },
        })

        this.fName = fName
        this.lName = lName
        this.phone = phone
        this.email = email
      } catch (err) {
        const { status } = err?.response?.data || {}
        if (status === 401) {
          this.$router.replace('/login')
        }
      }
    },
    async submitOrder() {
      try {
        const order = {
          price: +this.getTotal(),
          items: this.$store.state.cart,
          address: this.$store.state.user.addresses[this.addressIdx],
          username: this.$store.state.user.username,
        }
        const orderId = await this.$store.dispatch('submitOrder', {
          order,
          jwt: this.$store.state.jwt,
        })
        console.log('orderId', orderId)
        this.orderId = orderId
        this.$store.dispatch('setAlert', {
          alertMsg: 'Successfully placed your order!',
          showAlert: 5000,
          color: 'success',
        })
      } catch (err) {
        const { status } = err.response.data || {}
        if (status === 401) {
          this.$router.replace('/login')
        }
      }
    },
  },

  watch: {
    canShip: function () {
      if (this.canShip == false) {
        return
      }
      this.loading = true
      //calculate weight
      let total = 0
      let cart = this.$store.getters['cart']
      for (let i = 0; i < cart.length; i++) {
        total += cart[i].qty * 4
      }
      let lbs = Math.floor(total / 16)
      let ounces = total % 16

      //get shipping price;
      let url = `https://secure.shippingapis.com/shippingapi.dll?API=RateV4&XML=<RateV4Request USERID="842BRIGH3285"><Revision>2</Revision><Package ID="1ST"><Service>PRIORITY</Service><ZipOrigination>84602</ZipOrigination><ZipDestination>${this.zip}</ZipDestination><Pounds>${lbs}</Pounds><Ounces>${ounces}</Ounces><Container></Container><Width></Width><Length></Length><Height></Height><Girth></Girth><Machinable>false</Machinable></Package></RateV4Request>`
      fetch(url)
        .then((response) => response.text())
        .then((data) => {
          const parser = new DOMParser()
          const xml = parser.parseFromString(data, 'application/xml')
          this.loading = false
          let rate = xml.getElementsByTagName('Rate')[0].childNodes[0].nodeValue
          this.shippingPrice = rate
        })
        .catch((err) => {
          this.loading = false
          this.canShip = false
          this.$store.dispatch('setAlert', {
            alertMsg: 'Not a valid address.',
            showAlert: 5000,
            color: 'warning',
          })
        })
    },
  },
  computed: {
    computedAddresses() {
      return this.$store.state.user.addresses.length &&
        this.$store.state.user.addresses[0].street1
        ? this.$store.state.user.addresses
        : []
    },
  },
}
</script>


<style scoped>
.checkout {
  min-height: 100vh;
}

#my-modal {
  overflow-y: scroll;
}

.form-content {
  margin: 6rem 5%;
  display: flex;
  justify-content: flex-start;
  box-shadow: 0 10px 5px #888888;
  padding: 1rem 1rem;
  flex-wrap: wrap;
}

.contact {
  border-right: solid 1px #1e81b0;
  flex-basis: 60%;
}

.contact-in {
  margin: 1rem auto;
  width: 90%;
}

.contact-drop {
  width: 90%;
  margin-left: 5%;
}

.form-label {
  color: #1e81b0;
}

.btn-submit {
  margin-left: 5%;
  display: flex;
}

.order-info {
  padding-left: 5%;
  flex-basis: 40%;
}

.cart-icon {
  position: relative;
  width: fit-content;
  display: inline-block;
  margin: 1rem 0;
  margin-right: 1rem;
}

.cart-cnt {
  position: absolute;
  background-color: #000;
  border-radius: 40px;
  padding: 0.3rem;
  top: -50%;
  left: 60%;
  color: #fff;
  font-size: 0.5rem;
}

.loader {
  border: 4px solid #f3f3f3; /* Light grey */
  border-top: 4px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 35px;
  height: 35px;
  animation: spin 2s linear infinite;
  margin-right: 5%;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.confirm-shipping {
  display: flex;
  justify-content: flex-end;
  margin: 1em;
}

.order-conf {
  font-size: 21px;
}
.order-conf img {
  max-width: 50px;
}

.order-conf span {
  padding-left: 50px;
}

@media only screen and (max-width: 725px) {
  .form-content {
    flex-direction: column;
    justify-content: center;
  }

  .contact {
    border-right: none;
  }

  h3.form-label {
    margin-top: 1em;
  }
}
</style>