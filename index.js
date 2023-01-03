import express, { json } from 'express'
import cors from 'cors'
import promBundle from 'express-prom-bundle'

import mongoose from 'mongoose'

import { init } from './trace.cjs'
import Todo from './schemas/Todo.js'
const { tracer } = init('user-service', 'development')

const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: {
    project_name: 'server2',
    project_type: 'test_metrics_labels'
  },
  promClient: {
    collectDefaultMetrics: {}
  }
})

const app = express()
app.use(express.json())
app.use(metricsMiddleware)
app.use(cors())

app.get('/post', async (req, res) => {
  const resp = await fetch('https://jsonplaceholder.typicode.com/posts/1')

  const data = await resp.json()

  res.json(data)
})

app.get('/user', async (req, res) => {
  const activeSpan = tracer.startSpan('get user')

  const resp = await fetch('https://jsonplaceholder.typicode.com/users/1')

  const data = await resp.json()

  res.json(data)

  activeSpan.end()
})

app.post('/todo', async (req, res) => {
  const activeSpan = tracer.startSpan('post todo')

  const { todo } = req.body

  const newTodo = await Todo.create({
    title: todo
  })

  res.json(newTodo)
  activeSpan.end()
})

const start = async () => {
  try {
    await mongoose.connect(
      'mongodb://root:example@mongo:27017/todo?authSource=admin'
    )
    app.listen(3001, () => {
      console.log(`Server has been started on port 3001`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()

export default app
