import { PlaceHolderImages } from './placeholder-images';

export type ProductVariant = {
  id: string;
  name: string;
  priceModifier?: number;
  imageId: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageId: string;
  category: 'Incense' | 'Burner' | 'Merchandise';
  variants?: ProductVariant[];
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Varitas de Incienso Artesanal',
    description: 'Calma tu mente y alma con nuestras varitas de incienso hechas a mano. Elige tu fragancia favorita para crear el ambiente perfecto.',
    price: 8.99,
    imageId: 'incense-lavender', // Default image
    category: 'Incense',
    variants: [
      { id: 'v1', name: 'Flor de Lavanda', imageId: 'incense-lavender' },
      { id: 'v2', name: 'Sándalo Sagrado', priceModifier: 1.00, imageId: 'incense-sandalwood' },
      { id: 'v3', name: 'Rosa Mística', imageId: 'incense-rose' },
      { id: 'v4', name: 'Incienso Dorado', priceModifier: 2.00, imageId: 'incense-frankincense' },
    ],
  },
  {
    id: '5',
    name: 'Quemador Flor de Loto',
    description: 'Un elegante quemador de cerámica con forma de loto, perfecto para incienso en varita.',
    price: 19.99,
    imageId: 'burner-lotus',
    category: 'Burner',
  },
  {
    id: '6',
    name: 'Quemador de Reflujo Montaña Brumosa',
    description: 'Observa cómo el humo fluye suavemente como una cascada con este impresionante quemador de reflujo.',
    price: 29.99,
    imageId: 'burner-waterfall',
    category: 'Burner',
  },
  {
    id: '7',
    name: 'Bolso de Tela "Aura"',
    description: 'Lleva tus esenciales en este elegante y espiritual bolso de tela.',
    price: 24.99,
    imageId: 'merch-tote',
    category: 'Merchandise',
  },
  {
    id: '8',
    name: 'Taza "Momento Zen"',
    description: 'Comienza tu día con un momento de paz con nuestra taza de cerámica zen.',
    price: 15.99,
    imageId: 'merch-mug',
    category: 'Merchandise',
  },
];
