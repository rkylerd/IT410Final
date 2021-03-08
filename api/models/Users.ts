import Address from '../models/Address'

interface User {
    _id: string,
    username: string,
    email: string,
    password: string,
    fname: string,
    lname: string,
    phone: number,
    addresses: Array<Address> 
  }

  export default User;