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

config()
const { DB_UNAME, DB_PWD, DB_PORT, DB_NAME, ADMIN_USER_PWD, NODE_ENV, PORT } = process.env

// Create express instance
const app = express()

// Create a simple logging middleware
app.use((req: Request, res: Response, next: any) => {
  console.log(req.method.toUpperCase() + ' ' + req.path)
  next()
})

app.use('/health', (req: Request, res: Response, next: any) => {
  res.sendStatus(200)
})

// Add Body Parser
app.use(express.json())

// connect to the database
const connection = `mongodb://${DB_UNAME}:${DB_PWD}@127.0.0.1:${DB_PORT}/${DB_NAME}`
mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('MongoDB Connected')

    // Create an admin user
    const User = mongoose.model('User');
    if (!await User.findOne({ username: "admin" })) {
      await (new User({ ...admin, password: ADMIN_USER_PWD })).save();
    }

    // Load test items
    if (NODE_ENV === 'local') {
      const Item = mongoose.model('Item');
      if (!(await Item.find()).length) {
        await Item.insertMany(items);
      }
    }
  })
  .catch(err => {
    console.log(`Could not connect to ${`DB_UNAME=${DB_UNAME}, DB_PWD=${DB_PWD}, DB_NAME=${DB_NAME}, DB_PORT=${DB_PORT}`}`)
    console.log(err)
    process.exit(-1)
  });


const openapiPath = path.resolve(__dirname, 'open-api.yml')
const enforcerMiddleware = EnforcerMiddleware(Enforcer(openapiPath))
app.use(enforcerMiddleware.init())

// Catch errors
enforcerMiddleware.on('error', (err: Error) => {
  console.error(err)
  process.exit(-1)
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
  app.listen(PORT || 3001, () => {
    console.log(`API server listening on port ${PORT}`)
  })
}

export default app;