<template>
    <div class="bottom">
        <div>
            <b-form-select class="size" v-model="selected" :options="options"></b-form-select>
            <div class="qty">
                <label for="qty-input">Quantity</label>
                <b-form-input id="qty-input" class="qty-input" v-model="qty" type="number" min="1" :max="cap.stock"></b-form-input>
            </div>
            <div class="add-btn">
                <b-button class="add-btn-btn" ref="addbtn" @click="toggleAdd()">Add</b-button>
            </div>
        </div>
        
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
    props: {
        cap: Object,
    },
    data() {
        return {
            selected: null,
            qty: 1,
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
    },

    methods: {
        toggleAdd() {
            if (this.$refs.addbtn.innerText == "Add") {
                if (this.selected == null) {
                    this.$store.dispatch('setAlert', {
                        alertMsg: "Size must be selected.",
                        showAlert: 2000,
                        color: 'warning',
                    })
                    return;
                }
                this.$store.commit('addCart', {
                    item: this.cap,
                    size: this.selected,
                    qty: this.qty
                });
                this.$refs.addbtn.innerText = "Remove";
            } else {
                this.$refs.addbtn.innerText = "Add";
            }
        },
    }
}
</script>


<style scoped>

.bottom {
    padding: 0 1rem;
}

.size {
    margin: 1rem 0;
}

.qty {
    margin-bottom: 2rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.qty-input {
    margin: 0 1rem;
}

.add-btn {
    margin-bottom: 2rem;
}

.add-btn-btn {
    width: 8rem;
}

</style>