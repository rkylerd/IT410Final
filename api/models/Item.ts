import Size from '../models/Size'

interface Item {
    id: number,
    name: string,
    price: number,
    category: string,
    descrition: string,
    imageUrl: string,
    stock: number,
    sizes: Array<Size> 
  }

  export default Item;