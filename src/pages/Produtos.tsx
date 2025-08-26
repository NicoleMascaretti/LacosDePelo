import { useEffect, useState } from "react";
// import { fetchProducts } from "../services/Api";
import type { ProductType } from "../types/ProductType";
import ProductCard from "../components/ui/ProductCard";
import { Search, Filter, Grid, List, Star, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/Pagination';
import Navbar from '../components/Navbar';
import Footer from '../components/ui/Footer';

const categories = [
  'Todos',
  'Ração e Alimentação',
  'Brinquedos',
  'Higiene e Beleza',
  'Acessórios',
  'Medicamentos',
  'Casinhas e Transporte'
];

const mockProducts: ProductType[] = [
  {
    id: 1,
    name: "Ração Premium para Cães",
    price: 129.9,
    originalPrice: 159.9,
    category: "Rações",
    rating: 4.5,
    reviews: 23,
    image: "https://place-puppy.com/300x300",
    inStock: true,
    badge: "Mais Vendido",
  },
  {
    id: 2,
    name: "Brinquedo Mordedor",
    price: 39.9,
    originalPrice: 49.9,
    category: "Brinquedos",
    rating: 4.8,
    reviews: 12,
    image: "https://place-puppy.com/301x301",
    inStock: true,
    badge: "Novo",
  },
  {
    id: 3,
    name: "Coleira Ajustável",
    price: 24.9,
    originalPrice: 29.9,
    category: "Acessórios",
    rating: 4.2,
    reviews: 8,
    image: "https://place-puppy.com/302x302",
    inStock: true,
    badge: "Oferta",
  },
  {
    id: 4,
    name: "Shampoo Suave para Pets",
    price: 19.9,
    originalPrice: 25.9,
    category: "Higiene",
    rating: 4.7,
    reviews: 15,
    image: "https://place-puppy.com/303x303",
    inStock: true,
    badge: "Mais Vendido",
  },
  {
    id: 5,
    name: "Tapete Higiênico",
    price: 59.9,
    originalPrice: 69.9,
    category: "Higiene",
    rating: 4.3,
    reviews: 10,
    image: "https://place-puppy.com/304x304",
    inStock: true,
    badge: "Oferta",
  },
  {
    id: 6,
    name: "Ração Sênior para Gatos",
    price: 99.9,
    originalPrice: 119.9,
    category: "Rações",
    rating: 4.6,
    reviews: 18,
    image: "https://place-puppy.com/305x305",
    inStock: true,
    badge: "Mais Vendido",
  },
  {
    id: 7,
    name: "Arranhador para Gatos",
    price: 89.9,
    originalPrice: 109.9,
    category: "Brinquedos",
    rating: 4.9,
    reviews: 22,
    image: "https://place-puppy.com/306x306",
    inStock: true,
    badge: "Novo",
  },
  {
    id: 8,
    name: "Comedouro Antiformiga",
    price: 34.9,
    originalPrice: 44.9,
    category: "Acessórios",
    rating: 4.1,
    reviews: 6,
    image: "https://place-puppy.com/307x307",
    inStock: true,
    badge: "Oferta",
  },
  {
    id: 9,
    name: "Vermífugo Oral",
    price: 49.9,
    originalPrice: 59.9,
    category: "Medicamentos",
    rating: 4.4,
    reviews: 9,
    image: "https://place-puppy.com/308x308",
    inStock: true,
    badge: "Mais Vendido",
  },
  {
    id: 10,
    name: "Fralda Descartável para Pets",
    price: 44.9,
    originalPrice: 54.9,
    category: "Higiene",
    rating: 4.0,
    reviews: 5,
    image: "https://place-puppy.com/309x309",
    inStock: true,
    badge: "Novo",
  }
];

const Produtos = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);
  // Resolver depois isso daqui
  //  useEffect(() => {
  //   fetchProducts()
  //     .then(setProducts)
  //     .catch(() => alert("Erro ao carregar produtos"))
  //     .finally(() => setLoading(false));
  // }, []);

  useEffect(() => {
    // Simula carregamento de produtos mockados
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500); // 0.5s para simular loading
  }, []);

  // if (loading) return <div><p className="p-4">Carregando produtos...</p></div>;
  if (loading) return(
    <div>
      <div className="animate">
        <div className="loader">asdas</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Page Header */}
      <div className="bg-gradient-to-r from-teal-600 to-orange-400 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Nossos Produtos
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Descubra nossa seleção completa de produtos para o bem-estar e felicidade do seu melhor amigo
          </p>
        </div>
      </div>

      <div className="container max-w-7xl px-4 mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2 text-teal-600" />
                Filtros
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Produto
                </label>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Digite o nome do produto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Categorias
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === category
                        ? 'bg-teal-100 text-teal-800 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <p className="text-gray-600">
                  Exibindo {paginatedProducts.length} de {filteredProducts.length} produtos
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 mb-8 ${viewMode === 'grid'
              ? 'sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
              }`}>
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${viewMode === 'list' ? 'flex' : ''
                    }`}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-48' : ''}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`object-cover group-hover:scale-105 transition-transform duration-300 ${viewMode === 'list' ? 'w-48 h-full' : 'w-full h-48'
                        }`}
                    />

                    {product.badge && (
                      <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-bold rounded-full text-white ${product.badge === 'Mais Vendido' ? 'bg-emerald-600' :
                        product.badge === 'Promoção' ? 'bg-red-600' :
                          product.badge === 'Novo' ? 'bg-blue-600' :
                            product.badge === 'Premium' ? 'bg-purple-600' :
                              product.badge === 'Natural' ? 'bg-green-600' : 'bg-teal-600'
                        }`}>
                        {product.badge}
                      </span>
                    )}

                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Esgotado
                        </span>
                      </div>
                    )}

                    <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                      <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                    </button>
                  </div>

                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="mb-2">
                      <span className="text-xs text-teal-600 font-medium">{product.category}</span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-emerald-600">
                          R$ {product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            R$ {product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors"
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {product.inStock ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(i + 1);
                        }}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Produtos;