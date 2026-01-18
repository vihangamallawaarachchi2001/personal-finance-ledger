import { Schema, model, models } from 'mongoose'

const SavingsGoalSchema = new Schema({
  name: String,
  targetAmount: Number,
  currentAmount: Number,
})

export default models.SavingsGoal || model('SavingsGoal', SavingsGoalSchema)
