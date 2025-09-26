import { PlaceHolderImages } from './placeholder-images';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageId: string;
  category: 'Incense' | 'Burner' | 'Merchandise';
};

function getImageUrl(id: string) {
  return PlaceHolderImages.find((img) => img.id === id)?.imageUrl || 'https://placehold.co/400x400';
}
function getImageHint(id: string) {
    return PlaceHolderImages.find((img) => img.id === id)?.imageHint || 'product';
}


export const incenseSticks: Product[] = [
  {
    id: '1',
    name: 'Lavender Bloom Incense',
    description: 'Calming lavender incense to soothe your mind and soul.',
    price: 8.99,
    imageId: 'incense-lavender',
    category: 'Incense',
  },
  {
    id: '2',
    name: 'Sacred Sandalwood Sticks',
    description: 'Classic sandalwood for meditation and spiritual clarity.',
    price: 9.99,
    imageId: 'incense-sandalwood',
    category: 'Incense',
  },
  {
    id: '3',
    name: 'Mystic Rose Incense',
    description: 'A fragrant rose aroma to open your heart and inspire love.',
    price: 8.99,
    imageId: 'incense-rose',
    category: 'Incense',
  },
  {
    id: '4',
    name: 'Golden Frankincense',
    description: 'Purifying frankincense to cleanse your space and elevate your spirit.',
    price: 10.99,
    imageId: 'incense-frankincense',
    category: 'Incense',
  },
];

export const products: Product[] = [
  ...incenseSticks,
  {
    id: '5',
    name: 'Lotus Blossom Burner',
    description: 'An elegant ceramic lotus burner, perfect for stick incense.',
    price: 19.99,
    imageId: 'burner-lotus',
    category: 'Burner',
  },
  {
    id: '6',
    name: 'Misty Mountain Backflow Burner',
    description: 'Watch smoke gently flow like a waterfall with this stunning backflow burner.',
    price: 29.99,
    imageId: 'burner-waterfall',
    category: 'Burner',
  },
  {
    id: '7',
    name: 'Aura Tote Bag',
    description: 'Carry your essentials in this stylish and spiritual canvas tote bag.',
    price: 24.99,
    imageId: 'merch-tote',
    category: 'Merchandise',
  },
  {
    id: '8',
    name: 'Zen Moment Mug',
    description: 'Start your day with a moment of peace with our ceramic zen mug.',
    price: 15.99,
    imageId: 'merch-mug',
    category: 'Merchandise',
  },
];
