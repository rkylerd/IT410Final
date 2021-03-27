import Address from '../models/Address'

interface User {
  _id: string,
  username: string,
  email: string,
  password: string,
  fName: string,
  lName: string,
  phone: string,
  addresses: Array<Address>
}

export default User;