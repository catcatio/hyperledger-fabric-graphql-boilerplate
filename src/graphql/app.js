// @flow

import 'isomorphic-fetch'

import express from 'express'
import cors from 'cors'

import { schema } from './schema'
import { jwtSecret } from './config'
import { getAdminUser } from './auth'
import setup from '../blockchain/blockchain'
import createLoaders from './loader/hyperledger/Hyperledger'

const app = express()
app.keys = jwtSecret

let blockchain

// TODO - init function, find a better way of do it
;(async () => {
  try {
    blockchain = await setup()
  } catch (err) {
    console.log('err:', err)
  }
})()

app.use(cors())
const graphqlHTTP = require('express-graphql')
app.use(
  '/graphql',
  graphqlHTTP(async req => {
    const user = await getAdminUser(req.header.authorization)

    const { chain, chaincodeID, webUser } = blockchain

    const hpLoaders = createLoaders(webUser, chaincodeID)

    return {
      graphiql: true,
      schema,
      context: {
        user,
        chain,
        chaincodeID,
        webUser,
        hpLoaders
      },
      formatError: error => {
        console.log(error.message)
        console.log(error.locations)
        console.log(error.stack)

        return {
          message: error.message,
          locations: error.locations,
          stack: error.stack
        }
      }
    }
  })
)

export default app
