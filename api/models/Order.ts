import Item from './CartItem'
import Address from './Address'

interface Order {
  id: number,
  price: number,
  dateCreated: string,
  inPersonPickup: boolean,
  expectedArrivalDate: string,
  label: string,
  trackingId: string,
  items: Array<Item>,
  status: string,
  address: Address,
  userid: string
}

export default Order;