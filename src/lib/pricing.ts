import { PriceGuidance } from '@/types';

// UAE market research-based pottery pricing in AED
export const priceGuidance: PriceGuidance[] = [
  {
    category: 'Indoor Planters',
    sizeSmall: { min: 45, max: 85 },
    sizeMedium: { min: 90, max: 180 },
    sizeLarge: { min: 190, max: 350 },
  },
  {
    category: 'Outdoor Planters',
    sizeSmall: { min: 65, max: 120 },
    sizeMedium: { min: 130, max: 240 },
    sizeLarge: { min: 250, max: 480 },
  },
  {
    category: 'Decorative Pots',
    sizeSmall: { min: 55, max: 95 },
    sizeMedium: { min: 100, max: 190 },
    sizeLarge: { min: 200, max: 380 },
  },
  {
    category: 'Garden Sets',
    sizeSmall: { min: 180, max: 320 },
    sizeMedium: { min: 350, max: 550 },
    sizeLarge: { min: 580, max: 950 },
  },
  {
    category: 'Custom Orders',
    sizeSmall: { min: 150, max: 250 },
    sizeMedium: { min: 280, max: 450 },
    sizeLarge: { min: 480, max: 850 },
  },
  {
    category: 'Traditional Clay Pots',
    sizeSmall: { min: 35, max: 70 },
    sizeMedium: { min: 75, max: 140 },
    sizeLarge: { min: 150, max: 280 },
  },
];

export const categories = [
  'Indoor Planters',
  'Outdoor Planters',
  'Decorative Pots',
  'Garden Sets',
  'Custom Orders',
  'Traditional Clay Pots',
];

export const sizes = ['Small', 'Medium', 'Large'];

export function getSuggestedPrice(category: string, size: string): number {
  const guidance = priceGuidance.find(g => g.category === category);
  if (!guidance) return 100;

  let range;
  if (size === 'Small') range = guidance.sizeSmall;
  else if (size === 'Medium') range = guidance.sizeMedium;
  else range = guidance.sizeLarge;

  // Return middle of range
  return Math.round((range.min + range.max) / 2);
}
