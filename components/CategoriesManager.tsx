'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Trash2, Plus } from 'lucide-react'
import type { Category } from '@/lib/types'

interface CategoriesManagerProps {
  categories: Category[]
  onAddCategory: (category: Category) => void
  onDeleteCategory: (id: string) => void
}

const PRESET_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#6BCB77', // Green
  '#B0B0B0', // Gray
  '#FFD93D', // Yellow
  '#FF8C42', // Orange
  '#D946EF', // Purple
]

export default function CategoriesManager({
  categories,
  onAddCategory,
  onDeleteCategory,
}: CategoriesManagerProps) {
  const [name, setName] = useState('')
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0])
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleAddCategory = () => {
    if (!name.trim()) {
      alert('Please enter a category name')
      return
    }

    // Check if category already exists
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      alert('This category already exists')
      return
    }

    onAddCategory({
      id: Date.now().toString(),
      name: name.trim(),
      color: selectedColor,
    })

    setName('')
    setSelectedColor(PRESET_COLORS[0])
    setShowColorPicker(false)
  }

  return (
    <div className="space-y-6">
      {/* Add Category Form */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Add Category
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Category Name
            </label>
            <Input
              type="text"
              placeholder="e.g., Dining Out"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAddCategory()
              }}
              className="bg-muted border-border"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Color
            </label>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full p-3 rounded-md border border-border bg-muted hover:bg-muted/80 transition-colors flex items-center gap-2"
            >
              <div
                className="w-6 h-6 rounded border border-foreground/20"
                style={{ backgroundColor: selectedColor }}
              ></div>
              <span className="text-foreground">{selectedColor}</span>
            </button>

            {showColorPicker && (
              <div className="grid grid-cols-5 gap-2 mt-3">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color)
                      setShowColorPicker(false)
                    }}
                    className="w-full aspect-square rounded-md border-2 hover:border-foreground transition-all"
                    style={{
                      backgroundColor: color,
                      borderColor:
                        selectedColor === color ? '#000' : 'transparent',
                    }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleAddCategory}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </Card>

      {/* Categories List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">
          Manage Categories
        </h2>
        {categories.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No categories yet
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="p-4 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: category.color || '#B0B0B0' }}
                  ></div>
                  <span className="font-medium text-foreground">
                    {category.name}
                  </span>
                </div>
                <button
                  onClick={() => onDeleteCategory(category.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <Card className="p-4 bg-muted border border-border">
        <p className="text-sm text-muted-foreground">
          <strong>Tip:</strong> Categories help organize your transactions and
          set budgets. You can add custom categories or manage the default ones.
        </p>
      </Card>
    </div>
  )
}
