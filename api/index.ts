import express, { Request, Response } from 'express'
import path from 'path'
import Enforcer from 'openapi-enforcer'
import EnforcerMiddleware from 'openapi-enforcer-middleware'
import { config } from 'dotenv'
import auth from './auth'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import itemSchema from './schemas/Item'
import orderSchema from './schemas/Order'
import userSchema from './schemas/User'
import { admin, items } from './mongo-data'

config();
const env = process.env;
// Create express instance
const app = express()

// Create a simple logging middleware
app.use((req: Request, res: Response, next: any) => {
  console.log(req.method.toUpperCase() + ' ' + req.path)
  next()
})

// Add Body Parser
app.use(express.json())

// connect to the database
const connection = `mongodb://${env.DB_UNAME}:${env.DB_PWD}@127.0.0.1:27017/${env.DB_NAME}`;
mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('MongoDB Connected');

    // Create an admin user
    const User = mongoose.model('User');
    if (!await User.findOne({ username: "admin" })) {
      await (new User({ ...admin, password: env.ADMIN_USER_PWD })).save();
    }

    // Load test items
    if (env.NODE_ENV === 'local') {
      const Item = mongoose.model('Item');
      if (!(await Item.find()).length) {
        await Item.insertMany(items);
      }
    }

  })
  .catch(err => {
    console.log(`Could not connect to ${`DB_UNAME=${env.DB_UNAME}, DB_PWD=${env.DB_PWD}, DB_NAME=${env.DB_NAME}`}`);
    console.log(err)
    process.exit(-1);
  });


const openapiPath = path.resolve(__dirname, 'open-api.yml')
const enforcerMiddleware = EnforcerMiddleware(Enforcer(openapiPath))
app.use(enforcerMiddleware.init())

// Catch errors
enforcerMiddleware.on('error', (err: Error) => {
  console.error(err)
  // process.exit(1)
})

const dependencies = {
  common: [auth, mongoose],
  users: [bcrypt, userSchema],
  orders: [orderSchema],
  items: [itemSchema]
};
const controllersPath = path.resolve(__dirname, 'controllers')
app.use(enforcerMiddleware.route(controllersPath, dependencies))

if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}