export const state = () => ({
    caps: [
        {
            id: 1,
            name: "",
            price: 5,
            category: "",
            description: "",
            imageUrl: "",
            stock: 2,
            sizes: ['small', 'medium', 'large'],
            promotionalFlag: false,
            promotionalPrice: 3
        },
    ],
  })
  
export const mutations = {
  increment(state) {
    state.counter++
  }
}