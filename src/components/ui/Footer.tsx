import { Link } from 'react-router-dom'; // 1. Importe o Link
import LogoInvertida from "../ui/LogoInvertida";
import { Mail, Phone, MapPin } from 'lucide-react';

// 2. Crie uma lista de categorias para facilitar a renderização
const categories = [
  { name: 'Rações & Alimentação', slug: 'racoes-e-alimentacao' },
  { name: 'Brinquedos', slug: 'brinquedos' },
  { name: 'Higiene & Beleza', slug: 'higiene-e-beleza' },
  { name: 'Acessórios', slug: 'acessorios' },
  { name: 'Medicamentos', slug: 'medicamentos' },
];

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white">
      <div className="container px-4 mx-auto py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <LogoInvertida className="h-12 w-auto  brightness-0 invert" />
            </div>
            <p className="text-gray-400 leading-relaxed mr-12">
              Sua loja online especializada em produtos para pets.
              Carinho, qualidade e os melhores preços para criar laços especiais com seu melhor amigo.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Links Rápidos</h3>
            <div className="space-y-2">
              {/* 3. Troque <a> por <Link> e href por to */}
              <Link to="/" className="block text-gray-400 hover:text-teal-400 transition-colors">Início</Link>
              <Link to="/produtos" className="block text-gray-400 hover:text-teal-400 transition-colors">Produtos</Link>
              <Link to="/sobre" className="block text-gray-400 hover:text-teal-400 transition-colors">Sobre</Link>
              <Link to="/contato" className="block text-gray-400 hover:text-teal-400 transition-colors">Contato</Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Categorias</h3>
            <div className="space-y-2">
              {/* 4. Use .map() para criar os links dinamicamente */}
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/produtos?categoria=${category.slug}`}
                  className="block text-gray-400 hover:text-teal-400 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-teal-400" />
                <span className="text-gray-400">(11) 99598-4383</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-teal-400" />
                <span className="text-gray-400">lacosdepelo.atendimento@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-teal-400" />
                <span className="text-gray-400">São Caetano do Sul, São Paulo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="w-full border-t border-gray-800">
        <div className="container px-4 mx-auto py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 Laços de Pelo. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/politica-de-privacidade" className="text-gray-400 hover:text-teal-400 transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/termos-de-uso" className="text-gray-400 hover:text-teal-400 transition-colors">
                Termos de Uso
              </Link>
              <Link to="/trocas-e-devolucoes" className="text-gray-400 hover:text-teal-400 transition-colors">
                Trocas e Devoluções
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};