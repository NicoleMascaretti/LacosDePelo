import { useNavigate } from "react-router-dom";
import { slugify } from "../../services/slug";

interface CardCategoriaProps {
  img: string;
  titulo: string;
  sub: string;
}

const CardCategoria = ({ img, titulo, sub }: CardCategoriaProps) => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    const categorySlug = slugify(categoryName);
    navigate({
      pathname: "/produtos",
      search: `?categoria=${encodeURIComponent(categorySlug)}`,
    });
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        handleCategoryClick(titulo);
      }}
      className="w-full bg-white rounded-xl shadow-lg overflow-hidden font-sans cursor-pointer hover:-translate-y-2 transform-gpu duration-100"
    >
      <div className="aspect-w-4 aspect-h-3 sm:aspect-w-16 sm:aspect-h-9">
        <img src={img} alt="imagem produto" className="w-full h-48 object-cover" />
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="font-bold text-base sm:text-lg">{titulo}</h2>
        </div>
        <p className="text-sm sm:text-base text-gray-500">{sub}</p>
      </div>
    </div>
  );
};

export default CardCategoria;
