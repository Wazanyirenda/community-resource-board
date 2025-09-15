export const RESOURCE_CATEGORIES = [
  {
    value: 'books-learning',
    label: 'Books & Learning',
    description: 'Textbooks, study materials, educational resources'
  },
  {
    value: 'tools-equipment',
    label: 'Tools & Equipment',
    description: 'Power tools, gardening equipment, household items'
  },
  {
    value: 'food-essentials',
    label: 'Food & Essentials',
    description: 'Surplus food, household items, personal care'
  },
  {
    value: 'services-skills',
    label: 'Services & Skills',
    description: 'Tutoring, workshops, volunteer opportunities'
  },
  {
    value: 'furniture-home',
    label: 'Furniture & Home',
    description: 'Furniture, decor, household appliances'
  },
  {
    value: 'electronics',
    label: 'Electronics',
    description: 'Computers, phones, gadgets, accessories'
  },
  {
    value: 'clothing-accessories',
    label: 'Clothing & Accessories',
    description: 'Clothes, shoes, bags, jewelry'
  },
  {
    value: 'sports-recreation',
    label: 'Sports & Recreation',
    description: 'Sports equipment, games, recreational items'
  },
  {
    value: 'transportation',
    label: 'Transportation',
    description: 'Bicycles, car accessories, travel gear'
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Items that don\'t fit other categories'
  }
] as const

export type ResourceCategory = typeof RESOURCE_CATEGORIES[number]['value']
