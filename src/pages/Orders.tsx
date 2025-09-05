import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import Navbar from '../components/Navbar';

// Mock data para demonstração
const mockOrders = [
  {
    id: '12345',
    date: '2025-01-02',
    status: 'entregue',
    total: 149.90,
    items: [
      { name: 'Ração Golden Formula Cães Adultos 15kg', quantity: 1, price: 89.90 },
      { name: 'Brinquedo Dental Kong Classic', quantity: 2, price: 30.00 }
    ],
    shippingAddress: 'Rua das Flores, 123 - São Paulo, SP'
  },
  {
    id: '12346',
    date: '2025-01-04',
    status: 'em_transito',
    total: 89.90,
    items: [
      { name: 'Petisco Natural Frango Desidratado 200g', quantity: 3, price: 29.97 }
    ],
    shippingAddress: 'Av. Paulista, 456 - São Paulo, SP',
    trackingCode: 'BR123456789'
  },
  {
    id: '12347',
    date: '2025-01-05',
    status: 'processando',
    total: 199.80,
    items: [
      { name: 'Comedouro Automático Smart Pet', quantity: 1, price: 159.90 },
      { name: 'Tapete Higiênico 60x90cm (30 unidades)', quantity: 1, price: 39.90 }
    ],
    shippingAddress: 'Rua da Consolação, 789 - São Paulo, SP'
  }
];

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'processando':
      return { label: 'Processando', color: 'bg-yellow-500', icon: Clock };
    case 'em_transito':
      return { label: 'Em Trânsito', color: 'bg-blue-500', icon: Truck };
    case 'entregue':
      return { label: 'Entregue', color: 'bg-green-500', icon: CheckCircle };
    default:
      return { label: 'Pendente', color: 'bg-gray-500', icon: Package };
  }
};

const Orders = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Pedidos</h1>
          <p className="text-gray-600">Acompanhe o status das suas compras</p>
        </div>

        <div className="space-y-6">
          {mockOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-white border-b">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Realizado em {new Date(order.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className={`${statusInfo.color} text-white`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          R$ {order.total.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Itens do pedido */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Itens do Pedido</h3>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-600">Quantidade: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-medium text-gray-900 ml-4">
                              R$ {item.price.toFixed(2).replace('.', ',')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Informações de entrega */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Entrega</h3>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                        </div>

                        {order.trackingCode && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-1">Código de rastreamento:</p>
                            <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-900">
                              {order.trackingCode}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>

                    {order.status === 'em_transito' && (
                      <Button variant="outline" size="sm">
                        Rastrear Pedido
                      </Button>
                    )}

                    {order.status === 'entregue' && (
                      <Button variant="outline" size="sm">
                        Comprar Novamente
                      </Button>
                    )}

                    <Button variant="outline" size="sm">
                      Suporte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Estado vazio para quando não há pedidos */}
        {mockOrders.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Você ainda não fez nenhuma compra. Que tal explorar nossos produtos?
              </p>
              <Button asChild>
                <a href="/produtos">Ver Produtos</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Orders;