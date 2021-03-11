export const state = () => ({
    alertMsg: "",
    showAlert: 0,
    color: "",
    caps: [
        {
            id: 1,
            name: "Baseball Cap Black",
            price: 5,
            category: "baseball",
            description: "Black baseball cap",
            imageUrl: "",
            stock: 2,
            sizes: ['small', 'medium', 'large'],
            promotionalFlag: false,
            promotionalPrice: 3
        },
        {
            id: 2,
            name: "Baseball Cap Red",
            price: 5,
            category: "baseball",
            description: "Red baseball cap",
            imageUrl: "",
            stock: 2,
            sizes: ['small', 'medium', 'large'],
            promotionalFlag: false,
            promotionalPrice: 3
        },
        {
            id: 3,
            name: "Baseball Cap Blue",
            price: 5,
            category: "baseball",
            description: "Blue baseball cap",
            imageUrl: "",
            stock: 2,
            sizes: ['small', 'medium', 'large'],
            promotionalFlag: false,
            promotionalPrice: 3
        },
        {
            id: 4,
            name: "Fedora Grey",
            price: 5,
            category: "fedora",
            description: "Grey Fedora",
            imageUrl: "",
            stock: 2,
            sizes: ['small', 'medium', 'large'],
            promotionalFlag: false,
            promotionalPrice: 3
        },
        {
            id: 5,
            name: "Navy Blue Fedora",
            price: 5,
            category: "fedora",
            description: "Navy Blue Fedorea",
            imageUrl: "",
            stock: 2,
            sizes: ['small', 'medium', 'large'],
            promotionalFlag: false,
            promotionalPrice: 3
        },
        {
            id: 6,
            name: "Cotton Beanie Black",
            price: 5,
            category: "beanie",
            description: "Cotton Beanie Black",
            imageUrl: "",
            stock: 2,
            sizes: ['small', 'medium', 'large'],
            promotionalFlag: false,
            promotionalPrice: 3
        },
        {
            id: 7,
            name: "Light Grey Cotton Beanie",
            price: 5,
            category: "beanie",
            description: "Light Grey Cotton Beanie",
            imageUrl: "",
            stock: 2,
            sizes: ['small', 'medium', 'large'],
            promotionalFlag: false,
            promotionalPrice: 3
        },
        {
            id: 8,
            name: "Green Cotton Beanie",
            price: 5,
            category: "beanie",
            description: "Green Cotton Beanie",
            imageUrl: "",
            stock: 2,
            sizes: ['small', 'medium', 'large'],
            promotionalFlag: false,
            promotionalPrice: 3
        },
        {
            id: 1,
            name: "",
            price: 5,
            category: "top-hat",
            description: "",
            imageUrl: "",
            stock: 2,
            sizes: ['small', 'medium', 'large'],
            promotionalFlag: false,
            promotionalPrice: 3
        },
        {
            id: 1,
            name: "",
            price: 5,
            category: "top-hat",
            description: "",
            imageUrl: "",
            stock: 2,
            sizes: ['small', 'medium', 'large'],
            promotionalFlag: false,
            promotionalPrice: 3
        },
    ],
    cart: [],
  })
  
export const mutations = {
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
    setAlert(context, data) {
        context.commit('setShowAlert', data);
        setTimeout(() => {
            context.commit('resetTimer');
        }, data.showAlert);
    },
}