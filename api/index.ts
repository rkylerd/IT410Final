import express, { Request, Response } from 'express'
import path from 'path'
import Enforcer from 'openapi-enforcer'
import EnforcerMiddleware from 'openapi-enforcer-middleware'
import { config } from 'dotenv'

const conf = config();
// Create express instance
const app = express()

// Create a simple logging middleware
app.use((req:Request, res:Response, next:any) => {
  console.log(req.method.toUpperCase() + ' ' + req.path)
  next()
})

// Add Body Parser
app.use(express.json())

const openapiPath = path.resolve(__dirname, 'open-api.yml')
const enforcerMiddleware = EnforcerMiddleware(Enforcer(openapiPath))
app.use(enforcerMiddleware.init())

// Catch errors
enforcerMiddleware.on('error', (err: Error) => {
  console.error(err)
  // process.exit(1)
}) 

const controllersPath = path.resolve(__dirname, 'controllers')
app.use(enforcerMiddleware.route(controllersPath))
 
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}