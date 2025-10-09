import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { ProductType } from "../types/ProductType";
import ProductCardMobile from "../components/ui/ProductCardMobile";
import ProductCardDesktop from "../components/ui/ProductCardDesktop";
import { Filter, Grid, List, X } from "lucide-react";
import { Button } from "../components/ui/Button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/Pagination";
import Navbar from "../components/Navbar";
import Footer from "../components/ui/Footer";
import { slugify } from "../services/slug";
//import { useLoading } from "../hooks/useLoading";
//import { fetchProducts } from "../services/mockApi"; 
import Loading from "../components/ui/Loading";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useQuery, gql } from '@apollo/client';
import SearchInput from "../components/ui/SearchInput";
import { AnimatePresence, motion } from "framer-motion";

// Extrai um texto de categoria a partir do metafield da Shopify.
// Trata tanto list/JSON quanto string simples.
function extractCategory(meta?: { value?: string; type?: string }) {
  const raw = (meta?.value || "").trim();
  if (!raw) return "";

  // Se vier como lista (metafield do tipo list_*), o value é JSON
  if (meta?.type?.startsWith("list") || (raw.startsWith("[") && raw.endsWith("]"))) {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) return String(arr[0]).trim();
    } catch { }
  }

  // Remove aspas se for string com aspas
  return raw.replace(/^"(.*)"$/, "$1").trim();
}

// Tipos para a resposta da API
interface ShopifyProductNode {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  priceRange: { minVariantPrice: { amount: string; } };
  images: { edges: { node: { url: string; altText: string | null; } }[]; };
}

interface GetProductsData {
  products: { edges: { node: ShopifyProductNode; }[]; };
}

const GET_PRODUCTS_QUERY = gql`
  query GetProducts($query: String!) {
    products(first: 12, query: $query) {
      edges {
        node {
          id
          handle
          title
          description
          productType
          images(first: 1) { edges { node { url altText } } }
          variants(first: 1) {
            nodes {
              id
              availableForSale
              price { amount }
            }
          }
          metafield(namespace: "custom", key: "category") {
            value
            type
          }
          # opcional (fallback):
          priceRange { minVariantPrice { amount } }
        }
      }
    }
  }
`;


const categories = [
  "Todos",
  "Rações e Alimentação",
  "Brinquedos",
  "Higiene e Beleza",
  "Acessórios",
  "Medicamentos",
  "Casinhas e Transporte",
];

const Produtos = () => {
  // const { data: products, loading, error } = useLoading<ProductType[]>(fetchProducts);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const [searchParams, setSearchParams] = useSearchParams();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchTerm = searchParams.get("search") || "";
  const shopifySearchQuery = searchTerm ? `title:*${searchTerm}*` : "";
  // Usamos o hook 'useQuery' da apollo para buscar os dados
  // Ele nos dá 'loading', 'error' e 'data' automaticamente.
  const { loading, error, data } = useQuery<GetProductsData>(GET_PRODUCTS_QUERY, {
    variables: { query: shopifySearchQuery },
  });

  useEffect(() => {
    const categorySlugFromUrl = searchParams.get("categoria");
    if (categorySlugFromUrl) {
      const categoryName = categories.find((c) => slugify(c) === categorySlugFromUrl);
      if (categoryName) {
        setSelectedCategory(categoryName);
      }
    } else {
      setSelectedCategory("Todos");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!data) return;

    try {
      const edges = (data.products?.edges ?? []);
      console.groupCollapsed("🧩 Produtos carregados da Shopify");
      edges.forEach(({ node }: any) => {
        const variantId = node?.variants?.nodes?.[0]?.id;
        console.log(`• ${node?.title ?? "(sem título)"} → variantId:`, variantId || "❌ sem variantId");
      });
      console.groupEnd();
    } catch (err) {
      console.warn("Falha no log de debug dos produtos:", err);
    }
  }, [data]);


  if (loading) return <Loading />;
  if (error) return <p className="p-4 text-center text-red-500">Erro ao carregar produtos: {error.message}</p>;

  // Transformamos os dados da Shopify para o nosso formato `ProductType`
  // Isso garante que o resto do nosso app continue funcionando sem alterações.
  const allProducts: ProductType[] = data?.products.edges.map(({ node }: any) => {
    const firstVariant = node.variants?.nodes?.[0];
    const variantId = firstVariant?.id || undefined;
    const variantPrice = firstVariant?.price?.amount
      ? parseFloat(firstVariant.price.amount)
      : undefined;

    const category = extractCategory(node.metafield) || "";
    const inStock =
      (typeof firstVariant?.availableForSale === "boolean"
        ? firstVariant.availableForSale
        : undefined) ??
      (typeof node.availableForSale === "boolean"
        ? node.availableForSale
        : true);

    return {
      id: node.id,
      handle: node.handle,
      name: node.title,
      description: node.description,
      image: node.images?.edges?.[0]?.node?.url || "",
      // use preço da variante se existir; senão, caia no minVariantPrice
      price: variantPrice ?? parseFloat(node.priceRange.minVariantPrice.amount),
      // novo campo para o carrinho/checkout:
      category,
      variantId,
      rating: 4.5,
      reviews: 0,
      inStock,
    };
  }) || [];

  // Lógica de Filtros
  const filteredProducts = allProducts.filter((product) => {
    if (selectedCategory === "Todos") return true;
    return product.category === selectedCategory;
  });
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);
  // ---- STATUS DA BUSCA/CATEGORIA + AÇÕES DE LIMPAR ----
  const hasSearch = !!searchTerm.trim();
  const hasCategory = selectedCategory !== "Todos";

  // exibidos nesta página vs total filtrado
  const displayed = paginatedProducts.length;
  const totalFiltered = filteredProducts.length;

  // limpar somente a busca
  const clearSearch = () => {
    searchParams.delete("search");
    setSearchParams(searchParams);
    setCurrentPage(1);
  };

  // limpar categoria (volta para "Todos")
  const clearCategory = () => {
    handleCategoryChange("Todos");
  };


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
            Descubra nossa seleção completa de produtos para o bem-estar e
            felicidade do seu melhor amigo
          </p>
        </div>
      </div>

      <div className="container px-4 mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          {/* Botão Filtros (só mobile) */}
          {!isDesktop && (
            <div className="flex justify-between mb-4">
              <SearchInput
              />
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700"
              >
                <Filter className="h-4 w-4" />
                Filtros
              </button>
            </div>
          )}


          {/* Sidebar de filtros (só desktop) */}
          {isDesktop && (
            <div className="w-64 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-teal-600" />
                  Filtros
                </h3>

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
                          ? "bg-teal-100 text-teal-800 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Drawer de filtros (só mobile) – com slide suave */}
          <AnimatePresence>
            {!isDesktop && isFilterOpen && (
              <>
                {/* Overlay com fade */}
                <motion.div
                  className="fixed inset-0 z-40 bg-black/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setIsFilterOpen(false)}
                />

                {/* Painel com slide da direita */}
                <motion.aside
                  className="fixed right-0 top-0 bottom-0 z-50 w-[85vw] max-w-sm bg-white shadow-xl"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="relative h-full p-6 overflow-y-auto">
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                      aria-label="Fechar filtros"
                    >
                      ✕
                    </button>

                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Filter className="h-5 w-5 mr-2 text-teal-600" />
                      Filtros
                    </h3>

                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Categorias
                    </label>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            handleCategoryChange(category);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === category
                            ? "bg-teal-100 text-teal-800 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>




          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              {/* Linha de status */}
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2"
              >
                <p className="text-gray-600 text-sm">
                  Exibindo <span className="font-semibold">{displayed}</span> de{" "}
                  <span className="font-semibold">{totalFiltered}</span> produtos
                  {hasSearch && (
                    <>
                      {" "}para <span className="font-semibold">&ldquo;{searchTerm}&rdquo;</span>
                    </>
                  )}
                  {hasCategory && (
                    <>
                      {" "}em <span className="font-semibold">{selectedCategory}</span>
                    </>
                  )}
                </p>

                {/* Chips de filtros ativos */}
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {hasSearch && (
                      <motion.button
                        key="chip-search"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={clearSearch}
                        className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
                        title="Limpar busca"
                      >
                        <span className="truncate max-w-[160px]">“{searchTerm}”</span>
                        <X className="h-3.5 w-3.5" />
                      </motion.button>
                    )}

                    {hasCategory && (
                      <motion.button
                        key="chip-cat"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={clearCategory}
                        className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
                        title="Limpar categoria"
                      >
                        {selectedCategory}
                        <X className="h-3.5 w-3.5" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Botões de layout (desktop) */}
              {isDesktop && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-gray-900 text-white hover:bg-gray-800" : ""}
                    title="Grade"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>

                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-gray-900 text-white hover:bg-gray-800" : ""}
                    title="Lista"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>


            {/* Products Grid */}
            <div
              className={`grid gap-6 mb-8 ${isDesktop
                ? viewMode === "grid"
                  ? "sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
                : "grid-cols-1"
                }`}
            >
              {paginatedProducts.length > 0 ? (
                // Se a lista de produtos NÃO estiver vazia, renderize os cards
                paginatedProducts.map((product) =>
                  isDesktop ? (
                    <ProductCardDesktop
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ) : (
                    <ProductCardMobile key={product.id} product={product} />
                  )
                )
              ) : (
                <div className="col-span-full text-center py-16">
                  <p className="text-gray-500 text-lg">Nenhum produto encontrado.</p>
                  <p className="text-gray-400 mt-2">Tente ajustar os filtros ou o termo de busca.</p>
                </div>
              )}
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
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
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
};

export default Produtos;