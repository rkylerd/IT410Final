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
    loginRedirectUrl: '',
    category: "all",
    searchText: "",
    caps: [],
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
    increment(state) {
        state.counter++
    },
    addCart(state, data) {
        //check if there is stuff in the cart
        //make sure we don't add something that is already in the cart
        if (state.cart.length != 0) {
            for (let i = 0; i < state.cart.length; i++) {
                if (state.cart[i].item.name == data.item.name) {
                    state.cart[i].qty += parseInt(data.qty);
                    return;
                }
            }
        }
        state.cart.push(data);
        return;
    },
    removeCart(state, data) {
        //check cart for item and remove it
        for (let i = 0; i < state.cart.length; i++) {
            if (state.cart[i].item.name == data) {
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
    }
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

    async getItems(context) {
        try {
            let response = await fetch('http://localhost:3000/api/item');
            let json = await response.json()
            context.commit('setCaps', json);
        } catch (err) {
            console.log(err);
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
}