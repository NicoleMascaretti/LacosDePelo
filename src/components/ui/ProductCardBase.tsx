import { useCart } from "../../hooks/useCart";
import { useFavorites } from "../../hooks/useFavorites";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import type { ProductType } from "../../types/ProductType";

interface ProductCardBaseProps {
  product: ProductType;
  children: (render: {
    isProductFavorite: boolean;
    handleFavoriteToggle: (e: React.MouseEvent) => void;
    handleAddToCart: (e: React.MouseEvent) => void;
  }) => React.ReactNode;
}

export default function ProductCardBase({ product, children }: ProductCardBaseProps) {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isProductFavorite = isFavorite(product.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isProductFavorite) {
      removeFromFavorites(product.id);
      toast.error(`${product.name} removido dos favoritos.`);
    } else {
      addToFavorites(product);
      toast.success(`${product.name} adicionado aos favoritos!`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, {
      variantId: (product as any).variantId, // ✅ garante que vai junto
      price: product.price,                   // opcional: reforça o preço
    });

    toast.success(`${product.name} adicionado ao carrinho!`);
  };



  return (
    <Link to={`/produto/${product.handle}`}>
      {children({ isProductFavorite, handleFavoriteToggle, handleAddToCart })}
    </Link>
  );
}
