"use client"

interface FilterChipsProps {
  tags: string[]
  activeFilterTag: string
  onFilterChange: (filter: string) => void
}

export function FilterChips({ tags, activeFilterTag, onFilterChange }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tags.map((category) => (
        <button
          key={category}
          onClick={() => onFilterChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeFilterTag === category
              ? "bg-yellow-500 text-stone-900"
              : "bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-600"
          }`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  )
}
