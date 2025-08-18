import { Search, Filter, Grid, List, Star, Heart, ShoppingCart } from 'lucide-react';
import SearchInput from "../ui/SearchInput";
import { useState } from 'react';
const categories = [
  'Todos',
  'Ração e Alimentação',
  'Brinquedos',
  'Higiene e Beleza',
  'Acessórios',
  'Medicamentos',
  'Casinhas e Transporte'
];

export const FilterSidebar = () => {
  const [search, setSearch] = useState("");
  return (
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
            <SearchInput
              placeholder="Digite o nome do produto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
  )
}