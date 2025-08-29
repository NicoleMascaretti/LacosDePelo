import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
// import { fetchProducts } from "../services/Api";
import type { ProductType } from "../types/ProductType";
import ProductCard from "../components/ui/ProductCard";
import { Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/Pagination';
import Navbar from '../components/Navbar';
import Footer from '../components/ui/Footer';

import { useLoading } from '../hooks/useLoading';
import { fetchProducts } from '../services/mockApi'; 
import Loading from '../components/ui/Loading';

const categories = [
  'Todos',
  'Rações e Alimentação', // "Ração e Alimentação" -> "Rações"
  'Brinquedos',
  'Higiene e Beleza', // "Higiene e Beleza" -> "Higiene"
  'Acessórios',
  'Medicamentos',
  'Casinhas e Transporte'
];


const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/&/g, 'e')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const Produtos = () => {
  const { data: products, loading, error } = useLoading<ProductType[]>(fetchProducts);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const [searchParams, setSearchParams] = useSearchParams();

  const filteredProducts = (products || []).filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  // Efeito para ler a URL e definir a categoria
  useEffect(() => {
    const categorySlugFromUrl = searchParams.get('categoria');
    if (categorySlugFromUrl) {
      // Encontra o nome original da categoria com base no slug da URL
      const categoryName = categories.find(c => slugify(c) === categorySlugFromUrl);
      if (categoryName) {
        setSelectedCategory(categoryName);
      }
    }
  }, [searchParams]);

  // Função para atualizar a categoria e a URL
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Resetar a página ao mudar de categoria
    if (category === 'Todos') {
      // Remove o parâmetro da URL
      searchParams.delete('categoria');
    } else {
      // Adiciona ou atualiza o parâmetro na URL
      searchParams.set('categoria', slugify(category));
    }
    setSearchParams(searchParams);
  };

  // if (loading) return <div><p className="p-4">Carregando produtos...</p></div>;
  if (loading) {
    return <Loading/>;
  }
  
  if (error) {
    return <div className="text-center p-8 text-red-500">Erro ao carregar produtos: {error.message}</div>;
  }
  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Page Header */}
      <div className="bg-gradient-to-r from-teal-600 to-orange-400 py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Nossos Produtos
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Descubra nossa seleção completa de produtos para o bem-estar e felicidade do seu melhor amigo
          </p>
        </div>
      </div>

      <div className="container px-4 mx-auto py-8">
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
                      onClick={() => handleCategoryChange(category)}
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
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
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