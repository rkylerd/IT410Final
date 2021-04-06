<template>
    <div class="content">
        <b-modal size="lg" ref="item-modal" class="item-modal" hide-footer>
            <div class="modal-container">
                <div>
                    <h4>Preview of Item</h4>
                    <Cap :cap="item" />
                </div>
                <b-form class="update-fields">
                    <b-row class="field-row">
                        <b-col>
                            <label for="item-name">Name:</label>
                        </b-col>
                        <b-col>
                            <b-form-input v-model="item.name" id="item-name" type="text" placeholder="Name"></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="field-row">
                        <b-col>
                            <label for="item-desc">Description:</label>
                        </b-col>
                        <b-col>
                            <b-form-input v-model="item.description" id="item-desc" type="text" placeholder="Description"></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="field-row">
                        <b-col>
                            <label for="item-stock">Stock:</label>
                        </b-col>
                        <b-col>
                            <b-form-input v-model="item.stock" id="item-stock" type="number" placeholder="Description"></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="field-row">
                        <b-col>
                            <label for="item-price">Price:</label>
                        </b-col>
                        <b-col>
                            <b-form-input v-model="item.price" id="item-price" type="number" placeholder="Description"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row class="field-row">
                        <b-col>
                            <label for="item-pp">Promotional Price:</label>
                        </b-col>
                        <b-col>
                            <b-form-input v-model="item.promotionalPrice" id="item-pp" type="number" placeholder="Description"></b-form-input>
                        </b-col>
                    </b-row>

                    <b-row class="field-row">
                        <h5>On Promotion</h5>
                        <b-form-radio class="modal-radio" v-model="item.promotionalFlag" value="true">True</b-form-radio>
                        <b-form-radio class="modal-radio" v-model="item.promotionalFlag" value="false">False</b-form-radio>
                    </b-row>
                    <b-button @click="update()" variant="primary">Update Info</b-button>
                    <b-button @click="remove()" variant="primary">Delete</b-button>
                </b-form>
                
            </div>
        </b-modal>
        <div >
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th>PromotionalPrice</th>
                        <th>PromotionalFlag</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items" :key="item._id">
                        <td>{{item.name}}</td>
                        <td>{{item.category}}</td>
                        <td>{{item.stock}}</td>
                        <td>{{item.price}}</td>
                        <td>{{item.promotionalPrice}}</td>
                        <td>{{item.promotionalFlag}}</td>
                        <td><b-button @click="showModal(item)" variant="primary">Select</b-button></td>
                    </tr>
                </tbody>
            </table>

            <div class="button-container">
                <button @click="minusPage()" class="button-n"> < </button>
                <button class="button-n" @click="currentPage = index" v-for="index in rows" :key="index">{{index}}</button>
                <button @click="incPage()" class="button-n"> > </button>
            </div>

        </div>
    </div>
</template>


<script>
import Cap from '../caps/cap/Cap';
export default {
    components: {
        Cap,
    },
    data() {
      return {
        perPage: 3,
        currentPage: 1,
        item: {},
        rows: 1,
        isBusy: false,
      }
    },
    computed: {
        items() {
            return this.$store.getters['inventory'];
        }
    },
    methods: {
       async getInventory() {
            await this.$store.dispatch('getInventory', {
                page: this.currentPage,
                size: this.perPage
            });
        },
        async inventoryCount() {
            let response = await this.$store.dispatch('inventoryCount');
            let count = response.count;
            count = Math.ceil(count / this.perPage);
            this.rows = count;
        },
        minusPage() {
            if (this.currentPage == 1) {
                return;
            }
            this.currentPage--;
        },
        incPage() {
            if (this.currentPage == this.rows) {
                return;
            }
            this.currentPage++;
        },
        showModal(item) {
            this.item = item;
            this.$refs['item-modal'].show();
        },
        async update() {
            await this.$store.dispatch('updateItem', {
                _id: this.item._id,
                data: {
                    name: this.item.name,
                    description: this.item.description,
                    stock: this.item.stock,
                    price: this.item.price,
                    promotionalPrice: this.item.promotionalPrice,
                    promotionalFlag: this.item.promotionalFlag,
                }
            });
        },
        delete() {
            
        },
    },
    mounted() {
        this.getInventory();  
        this.inventoryCount();  
    },
    watch: {
        currentPage: function() {
            this.getInventory();
        }
    } 
}
</script>


<style scoped>

.content {
    width: 95%;
    height: 90%;
    margin: 5rem auto;
    box-shadow: 0 10px 5px #888888;
    padding: 1rem 1rem;
}

.button-container {
    display: flex;
    justify-content: center;
}

.button-n {
    background-color: #fff;
    color: #114b5f;
}

.item-modal {
    
}

.modal-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.update-fields {
}

.field-row {
    margin: .8rem 0;
}

.modal-radio {
    margin: 0 .6rem;
}

</style>