import Category from '@/models/Category'

const DEFAULT_CATEGORIES = [
  { name: 'Food', color: '#FF6B6B' },
  { name: 'Transport', color: '#4ECDC4' },
  { name: 'Utilities', color: '#45B7D1' },
  { name: 'Entertainment', color: '#FFA07A' },
  { name: 'Healthcare', color: '#98D8C8' },
  { name: 'Savings', color: '#6BCB77' },
  { name: 'Miscellaneous', color: '#B0B0B0' },
]

export async function ensureDefaultCategories() {
  const count = await Category.countDocuments()
  if (count === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES)
  }
}
