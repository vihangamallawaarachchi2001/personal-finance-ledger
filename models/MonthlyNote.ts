import { Schema, model, models } from 'mongoose'

const MonthlyNoteSchema = new Schema({
  date: String,
  notes: String,
  reflection: String,
})

export default models.MonthlyNote || model('MonthlyNote', MonthlyNoteSchema)
