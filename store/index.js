import axios from 'axios';

export const state = () => ({
    jwt: "",
    user: {
        username: "",
        email: "",
        fName: "",
        lName: "",
        phone: "",
        addresses: [
            {
                street1: '',
                street2: '',
                city: '',
                state: '',
                zip: ''
            },
        ]
    },
    alertMsg: "",
    showAlert: 0,
    color: "",
    cart: [],
    redirectUrl: '/',
    category: "all",
    searchText: "",
    caps: [],
    inventory: [],
})

export const mutations = {
    setAuth(state, jwt = "") {
        window.localStorage.setItem('token', jwt);
        state.jwt = jwt;
    },
    setUser(state, user) {
        state.user = user ?
            { ...state.user, ...user } :
            {
                username: "",
                email: "",
                fName: "",
                lName: "",
                phone: "",
                addresses: []
            };
    },
    initializeCart(state, cart) {
        state.cart = cart;
    },
    increment(state) {
        state.counter++
    },
    addCart(state, data) {
        //check if there is stuff in the cart
        //make sure we don't add something that is already in the cart
        if (state.cart.length != 0) {
            for (let i = 0; i < state.cart.length; i++) {
                if (!state.cart[i]) continue;

                if (state.cart[i].name == data.name) {
                    state.cart[i].qty += data.qty;
                    return;
                }
            }
        }
        state.cart.push(data);
        return;
    },
    removeCart(state, { itemId = '', size = '' }) {
        //check cart for item and remove it
        for (let i = 0; i < state.cart.length; i++) {
            if (state.cart[i]._id === itemId && state.cart[i].size == size) {
                state.cart.splice(i, 1);
                break;
            }
        }
    },
    setShowAlert(state, data) {
        state.showAlert = data.showAlert;
        state.alertMsg = data.alertMsg;
        state.color = data.color;
    },
    resetTimer(state) {
        state.showAlert = 0;
    },
    setCaps(state, data) {
        state.caps = data;
    },
    setCategory(state, data) {
        state.category = data;
    },
    setSearchText(state, data) {
        state.searchText = data;
    },
    setInventory(state, data) {
        state.inventory = data;
    }
}

export const getters = {
    caps(state) {
        if (state.searchText != "") {
            return state.caps.filter((item) => {
                return item.name.toLowerCase().includes(state.searchText.toLowerCase());
            })
        }
        if (state.category != 'all') {
            return state.caps.filter((item) => {
                return item.category == state.category;
            });
        }
        return state.caps;
    },

    category(state) {
        return state.category;
    },

    cart(state) {
        return state.cart;
    },

    user(state) {
        return state.user;
    },

    inventory(state) {
        return state.inventory;
    },
}

export const actions = {
    setAuth(context, jwt) {
        context.commit('setAuth', jwt);
    },

    setUser(context, user) {
        context.commit('setUser', user);
    },

    setAlert(context, data) {
        context.commit('setShowAlert', data);
        setTimeout(() => {
            context.commit('resetTimer');
        }, data.showAlert);
    },

    addCart(context, { item: { _id, name, price, imageUrl, qty, size }, username = '', jwt = '' }) {
        try {
            const item = { _id, name, price, imageUrl, qty, size };
            if (jwt) {
                const options = {
                    headers: {
                        Authorization: `Bearer: ${jwt}`
                    }
                };

                this.$axios.post(`/api/cart/${username}`, item, options)
            }
            context.commit('addCart', item);
        } catch (err) {
            console.log('mesage', err.toString())
        }
    },
    removeCart(context, { itemId = '', username = '', jwt = '', size = '' }) {
        try {
            const options = {
                headers: {
                    Authorization: `Bearer: ${jwt}`
                }
            };

            this.$axios.delete(`/api/cart/${username}/${itemId}?size=${size}`, options)
            context.commit('removeCart', { size, itemId });
        } catch (err) {
            console.log('mesage', err.toString())
        }
    },

    async submitOrder(context, { order, jwt = '' }) {

        const options = {
            headers: {
                Authorization: `Bearer: ${jwt}`
            }
        };

        try {
            const { data: { orderId = '' } } = await this.$axios.post('/api/order', order, options);
            return orderId;
        } catch (err) {
            console.log('error', err)
        }
    },
    async getItems(context) {
        try {
            let response = await fetch('/api/item');
            let json = await response.json()
            context.commit('setCaps', json);
        } catch (err) {
            console.log(err);
        }
    },

    async getInventory(context, data) {
        try {
            const response = await this.$axios.get('/api/item/bypage?page=' + data.page + '&size=' + data.size);
            context.commit('setInventory', response.data);
            return response.data;
        } catch (err) {
            console.log(err);
            return err.response;
        }
    },

    async inventoryCount(context) {
        try {
            const response = await this.$axios.get('api/item/count');
            return response.data;
        } catch (err) {
            console.log(err);
            return err.response;
        }
    },

    async orders(context) {
        try {
            let response = await axios.get('/api/order');
            console.log(response);
        } catch (err) {
            console.log(err.response);
        }
    },

    async updateItem(context, data) {
        try {
            await this.$axios.put('/api/item/' + data._id, data.data);
        } catch (err) {
            console.log(err.response);
        }
    },
}