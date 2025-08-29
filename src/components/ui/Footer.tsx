import React from 'react';
import LogoInvertida from "../ui/LogoInvertida";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

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
            {/*             <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-teal-600 p-2 rounded-full transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-teal-600 p-2 rounded-full transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-teal-600 p-2 rounded-full transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div> */}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Links Rápidos</h3>
            <div className="space-y-2">
              <a href="/" className="block text-gray-400 hover:text-teal-400 transition-colors">Início</a>
              <a href="/produtos" className="block text-gray-400 hover:text-teal-400 transition-colors">Produtos</a>
              <a href="#" className="block text-gray-400 hover:text-teal-400 transition-colors">Categorias</a>
              <a href="/sobre" className="block text-gray-400 hover:text-teal-400 transition-colors">Sobre</a>
              <a href="/contato" className="block text-gray-400 hover:text-teal-400 transition-colors">Contato</a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Categorias</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-teal-400 transition-colors">Ração & Alimentação</a>
              <a href="#" className="block text-gray-400 hover:text-teal-400 transition-colors">Brinquedos</a>
              <a href="#" className="block text-gray-400 hover:text-teal-400 transition-colors">Higiene & Beleza</a>
              <a href="#" className="block text-gray-400 hover:text-teal-400 transition-colors">Acessórios</a>
              <a href="#" className="block text-gray-400 hover:text-teal-400 transition-colors">Medicamentos</a>
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
                <span className="text-gray-400">São Paulo, São Caetano do Sul</span>
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
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                Trocas e Devoluções
              </a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};
