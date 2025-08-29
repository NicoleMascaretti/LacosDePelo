import type { ProductType } from '../types/ProductType';

// Nosso "banco de dados" falso com todos os detalhes.
const mockProductDatabase: ProductType[] = [
  {
    id: 1,
    name: 'Ração Premier Golden Cães Adultos 15kg',
    price: 89.90,
    originalPrice: 109.90,
    rating: 4.8,
    reviews: 234,
    image: '/racao-premier-golden.jpg',
    badge: 'Mais Vendido',
    category: 'Rações e Alimentação',
    inStock: true,
    description: 'Ração super premium para cães adultos, formulada com ingredientes naturais e vitaminas essenciais para manter seu pet saudável e ativo.',
    features: ['Rico em proteínas', 'Sem conservantes', 'Fortalece o sistema imunológico', 'Melhora a digestão'],
    specifications: { peso: '15kg', idade: 'Cães adultos (1-7 anos)', sabor: 'Frango e arroz' }
  },
  {
    id: 2,
    name: 'Brinquedo Mordedor Resistente Kong',
    price: 24.90,
    originalPrice: 34.90,
    rating: 4.6,
    reviews: 156,
    image: '/brinquedo-kong.webp',
    badge: 'Promoção',
    category: 'Brinquedos',
    inStock: true,
    description: 'Brinquedo ultra resistente para cães que adoram mastigar. Feito com borracha natural de alta qualidade.',
    features: ['Material ultra resistente', 'Estimula a dentição', 'Reduz o estresse', 'Fácil de limpar'],
    specifications: { material: 'Borracha natural', tamanho: 'Médio (10cm)', cor: 'Vermelho' }
  },
  {
    id: 3,
    name: 'Vermífugo para Cachorros da Drontal Plus',
    price: 24.90,
    originalPrice: null,
    rating: 4.9,
    reviews: 430,
    image: '/vermifugo-drontal.webp',
    badge:  null,
    category: 'Medicamentos',
    inStock: true,
    description: 'Brinquedo ultra resistente para cães que adoram mastigar. Feito com borracha natural de alta qualidade.',
    features: ['Material ultra resistente', 'Estimula a dentição', 'Reduz o estresse', 'Fácil de limpar'],
    specifications: { material: 'Borracha natural', tamanho: 'Médio (10cm)', cor: 'Vermelho' }
  },
    {
    id: 4,
    name: 'Antipulgas e Carrapatos Bravecto',
    price: 350.90,
    originalPrice: null,
    rating: 4.9,
    reviews: 70,
    image: '/Bravecto.jpeg',
    badge:  null,
    category: 'Medicamentos',
    inStock: true,
    description: 'Antipulgas e Carrapatos Bravecto MSD para Cães de 4,5 a 10. É um comprimido para Cães de 4,5 a 10Kg, indicado para o tratamento de infestações por carrapatos e pulgas. Um comprimido mastigável com um sabor agradável, que é facilmente desfrutado pela maioria dos animais. Um único comprimido Bravecto é eficaz por 12 semanas (3 meses), quase três vezes mais do que soluções normais de mercado. O Bravecto começa a agir em 2 horas após sua ingestão matando pulgas e no tratamento do controle de carrapatos; ',
    specifications: { Duração: '3 meses', 'Indicado para': 'Cães acima de 12 meses', 'Unidade por embalagem': '1 pílula', 'Peso mínimo': '4,5kg', 'Peso máximo': '10kg' }
  },
];

// simulando as funções da API:

//Simula a busca de UM produto pelo ID:

export async function fetchProductById(id: number): Promise<ProductType> {
  console.log(`MOCK API: Buscando produto com ID: ${id}...`);
  // Simula o atraso da rede
  await new Promise(resolve => setTimeout(resolve, 800)); 

  const product = mockProductDatabase.find(p => p.id === id);

  if (product) {
    console.log("MOCK API: Produto encontrado.", product);
    return product;
  } else {
    console.error("MOCK API: Produto não encontrado.");
    throw new Error("Produto não encontrado no nosso banco de dados falso");
  }
}

// Simula a busca de TODOS os produtos:

export async function fetchProducts(): Promise<ProductType[]> {
  console.log("MOCK API: Buscando todos os produtos...");
  await new Promise(resolve => setTimeout(resolve, 500)); // Delay menor para a lista

  console.log("MOCK API: Retornando produtos.");
  return mockProductDatabase;
}