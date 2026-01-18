import { Schema, model, models } from 'mongoose'

const TransactionSchema = new Schema({
  date: String,
  description: String,
  category: String,
  income: Number,
  expense: Number,
})

export default models.Transaction || model('Transaction', TransactionSchema)
