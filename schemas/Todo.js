import { model, Schema } from 'mongoose'

const TodoSchema = new Schema({
  title: { type: String, require: true },
})

export default model('Todo', TodoSchema)
