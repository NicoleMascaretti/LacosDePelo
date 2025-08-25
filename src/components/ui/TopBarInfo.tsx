import { Phone, Mail, Truck } from "lucide-react";

export default function TopBarInfo() {
  return (
    <div className="container mx-auto px-6 lg:px-8">
      <div className="w-full bg-white text-sm text-gray-700 border-b max-sm:hidden">
        <div className="mx-auto flex justify-between items-center flex-wrap gap-2 py-2">

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              <Phone size={16} className="text-green-600" />
              <span>(11) 99999-9999</span>
            </div>

            <div className="flex items-center gap-1">
              <Mail size={16} />
              <span>contato@lacosdepelo.com</span>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              <span>Frete Grátis acima de R$ 100</span>
            </div>

            <div className="flex items-center gap-1">
              <Truck size={16} />
              <span>Entrega em 24h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
