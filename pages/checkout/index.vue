<template>
    <div class="checkout">
        <b-modal id="my-modal" hide-footer>
            <CartList />
        </b-modal>
        <div class="form-content">
            <div class="contact">
                <h3 class="form-label">Contact Info</h3>
                <b-form @submit.prevent="getShipping()">
                    <b-form-input required class="contact-in" v-model="fname" placeholder="first name"></b-form-input>
                    <b-form-input required class="contact-in" v-model="lname" placeholder="last name"></b-form-input>
                    <b-form-input required class="contact-in" v-model="phone" type="tel" placeholder="phone"></b-form-input>
                    <b-form-input required class="contact-in" v-model="email" type="email" placeholder="email"></b-form-input>
                    <h3 class="form-label">Shipping Address</h3>
                    <b-form-input required class="contact-in" v-model="street1" type="text" placeholder="Address Line 1"></b-form-input>
                    <b-form-input class="contact-in" v-model="street2" type="text" placeholder="Address Line 2"></b-form-input>
                    <b-form-input required class="contact-in" v-model="city" type="text" placeholder="City"></b-form-input>
                    <b-form-select required v-model="state" :options="options" class="contact-drop"></b-form-select>
                    <b-form-input required class="contact-in" v-model="zip" type="text" placeholder="Zip Code"></b-form-input>
                    <div class="confirm-shipping">
                        <b-button class="btn-submit" type="submit" variant="primary">Check Shipping</b-button>
                        <div :class="{loader: loading}"></div>
                    </div>
                </b-form>
            </div>

            <div class="order-info">
                <h3 class="form-label">Your Order</h3>
                <hr>
                <div class="cart-row">
                    <div class="cart-icon">
                        <p class="cart-cnt">{{this.$store.getters['cart'].length}}</p>
                        <img src="~/assets/images/icons/shopping-cart.png" alt="">
                    </div>
                    <b-button v-b-modal.my-modal class="cart-btn" variant="primary">View Cart</b-button>
                </div>
                <hr>
                <h4>Subtotal: ${{evalSub().toFixed(2)}}</h4>
                <hr>
                <h4>Shipping: ${{parseFloat(shippingPrice).toFixed(2)}}</h4>
                <hr>
                <h4>Total: ${{getTotal()}}</h4>
            </div>
        </div>
    </div>
</template>

<script>
import CartList from '../../components/cart-comp/CartList';
export default {
    components: {
        CartList,
    },
    data() {
        return {
            canShip: false,
            loading: false,
            shippingPrice: 0,
            fname: "q",
            lname: "q",
            phone: "q",
            email: "q@a",
            street1: "1328 Christley Ln",
            street2: "",
            city: "Elk Ridge",
            zip: "84651",
            state: null,
            options: [
                { value: null, text: "State" },
                { value: "Alabama", text: "Alabama" },
                { value: "Alaska", text: "Alaska" },
                { value: "Arizona", text: "Arizona" },
                { value: "Arkansas", text: "Arkansas" },
                { value: "California", text: "California" },
                { value: "Colorado", text: "Colorado" },
                { value: "Connecticut", text: "Connecticut" },
                { value: "Delaware", text: "Delaware" },
                { value: "Florida", text: "Florida" },
                { value: "Georgia", text: "Georgia" },
                { value: "Hawaii", text: "Hawaii" },
                { value: "Idaho", text: "Idaho" },
                { value: "Illinois", text: "Illinois" },
                { value: "Indiana", text: "Indiana" },
                { value: "Iowa", text: "Iowa" },
                { value: "Kansas", text: "Kansas" },
                { value: "Kentucky", text: "Kentucky" },
                { value: "Louisiana", text: "Louisiana" },
                { value: "Maine", text: "Maine" },
                { value: "Maryland", text: "Maryland" },
                { value: "Massachusetts", text: "Massachusetts" },
                { value: "Michigan", text: "Michigan" },
                { value: "Minnesota", text: "Minnesota" },
                { value: "Mississippi", text: "Mississippi" },
                { value: "Missouri", text: "Missouri" },
                { value: "Montana", text: "Montana" },
                { value: "Nebraska", text: "Nebraska" },
                { value: "Nevada", text: "Nevada" },
                { value: "New Hampshire", text: "New Hampshire" },
                { value: "New Jersey", text: "New Jersey" },
                { value: "New Mexico", text: "New Mexico" },
                { value: "New York", text: "New York" },
                { value: "North Carolina", text: "North Carolina" },
                { value: "North Dakota", text: "North Dakota" },
                { value: "Ohio", text: "Ohio" },
                { value: "Oklahoma", text: "Oklahoma" },
                { value: "Oregon", text: "Oregon" },
                { value: "Pennsylvania", text: "Pennsylvania" },
                { value: "Rhode Island", text: "Rhode Island" },
                { value: "South Carolina", text: "South Carolina" },
                { value: "South Dakota", text: "South Dakota" },
                { value: "Tennessee", text: "Tennessee" },
                { value: "Texas", text: "Texas" },
                { value: "Utah", text: "Utah" },
                { value: "Vermont", text: "Vermont" },
                { value: "Virginia", text: "Virginia" },
                { value: "Washington", text: "Washington" },
                { value: "West Virginia", text: "West Virginia" },
                { value: "Wisconsin", text: "Wisconsin" },
                { value: "Wyoming", text: "Wyoming" },
            ] 
        }
    },

    methods: {
        getShipping() {
            this.loading = true;
            if (!this.street1 || !this.city || !this.zip || !this.state) {
                this.$store.dispatch('setAlert', {
                        alertMsg: "Shipping address must be complete.",
                        showAlert: 2000,
                        color: 'warning',
                    })
                    return;
            }
            //verify address
            let street1 = `<Address1>${this.street1}</Address1>`;
            let street2 = `<Address2>${this.street2}</Address2>`;
            let city = `<City>${this.city}</City>`;
            let state = `<State>${this.state}</State>`;
            let zip = `<Zip5>${this.zip}</Zip5>`;
            let url = `https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=<AddressValidateRequest USERID="842BRIGH3285"><Address>${street1}${street2}${city}${state}${zip}<Zip4></Zip4></Address></AddressValidateRequest>`
            fetch(url)
                .then(response => response.text())
                .then(data => {
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(data, "application/xml");
                    this.loading = false;
                    let error = xml.getElementsByTagName('Error');
                    if (error.length != 0) {
                        this.canShip = false;
                        this.$store.dispatch('setAlert', {
                            alertMsg: "Not a valid address.",
                            showAlert: 5000,
                            color: 'warning',
                        });
                    } else {
                        this.canShip = true;
                    }
                })
                .catch((error) => {
                    this.loading = false;
                    this.canShip = false;
                    this.$store.dispatch('setAlert', {
                            alertMsg: "Not a valid address.",
                            showAlert: 5000,
                            color: 'warning',
                    });
                });
        },
        evalSub() {
            let cart = this.$store.getters['cart'];
            let total= 0;
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].item.promotionalFlag == true) {
                    total += (cart[i].item.promotionalPrice * cart[i].qty);
                } else {
                    total += (cart[i].item.price * cart[i].qty);
                }
            }
            return total;
        },
        getTotal() {
            let sub = this.evalSub();
            return (parseFloat(sub) + parseFloat(this.shippingPrice)).toFixed(2);
        }
    },

    watch: {
        canShip: function() {
            if (this.canShip == false) {
                return;
            }
            this.loading = true;
            //calculate weight
            let total = 0;
            let cart = this.$store.getters['cart'];
            for (let i = 0; i < cart.length; i++) {
                total += (cart[i].qty * 4);
            }
            let lbs = Math.floor(total / 16);
            let ounces = total % 16;

            //get shipping price;
            let url = `https://secure.shippingapis.com/shippingapi.dll?API=RateV4&XML=<RateV4Request USERID="842BRIGH3285"><Revision>2</Revision><Package ID="1ST"><Service>PRIORITY</Service><ZipOrigination>84602</ZipOrigination><ZipDestination>${this.zip}</ZipDestination><Pounds>${lbs}</Pounds><Ounces>${ounces}</Ounces><Container></Container><Width></Width><Length></Length><Height></Height><Girth></Girth><Machinable>false</Machinable></Package></RateV4Request>`;
            fetch(url)
                .then(response => response.text())
                .then(data => {
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(data, "application/xml");
                    this.loading = false;
                    let rate = xml.getElementsByTagName('Rate')[0].childNodes[0].nodeValue;
                    console.log(rate);
                    this.shippingPrice = rate;
                })
                .catch(err => {
                    this.loading = false;
                    this.canShip = false;
                    this.$store.dispatch('setAlert', {
                            alertMsg: "Not a valid address.",
                            showAlert: 5000,
                            color: 'warning',
                    });
                })
        }
    }

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
    padding: .3rem;
    top: -50%;
    left: 60%;
    color: #fff;
    font-size: .5rem;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.confirm-shipping {
    display: flex;
    justify-content: space-between;
}


@media only screen and (max-width: 725px) {
    .form-content {
        flex-direction: column;
    }

    .contact {
        order: 2;
        margin-top: 5rem;
    }
}

</style>