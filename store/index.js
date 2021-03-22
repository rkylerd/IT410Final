import axios from 'axios';

export const state = () => ({
    jwt: "",
    alertMsg: "",
    showAlert: 0,
    color: "",
    cart: [],
})

export const mutations = {
    setAuth(state, jwt = "") {
        state.jwt = jwt;
    },
    increment(state) {
        state.counter++
    },

    addCart(state, data) {
        //check if there is stuff in the cart
        //make sure we don't add something that is already in the cart
        if (state.cart.length != 0) {
            for (let i = 0; i < state.cart.length; i++) {
                if (state.cart.item.id == data.item.id) {
                    state.cart.qty += data.qty;
                    break;
                }
            }
        } else {
            state.cart.push(data);
        }
    },
    setShowAlert(state, data) {
        state.showAlert = data.showAlert;
        state.alertMsg = data.alertMsg;
        state.color = data.color;
    },

    resetTimer(state) {
        state.showAlert = 0;
    }
}

export const actions = {
    setAuth(context, jwt) {
        context.commit('setAuth', jwt);
    },


    setAlert(context, data) {
        context.commit('setShowAlert', data);
        setTimeout(() => {
            context.commit('resetTimer');
        }, data.showAlert);
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