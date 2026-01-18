import { Schema, model, models } from 'mongoose'

const BudgetSchema = new Schema({
  monthYear: String,
  expectedIncome: Number,
  categories: [
    {
      category: String,
      limit: Number,
    },
  ],
  savingsTarget: Number,
})

export default models.Budget || model('Budget', BudgetSchema)
