/* export interface ProductType {
    id: number;
    name: string;
    price: number;
    originalPrice: number | null;
    rating: number;
    reviews: number;
    image: string;
    badge: string | null;
    category: string;
    inStock: boolean;
} */

export interface ProductType {
  id: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  inStock: boolean;
  badge?: string | null;

  // Campos adicionais para a página de detalhes
  description?: string;
  features?: string[];
  specifications?: { [key: string]: string };
}