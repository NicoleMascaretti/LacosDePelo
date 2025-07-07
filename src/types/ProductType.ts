export interface ProductType {
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
}