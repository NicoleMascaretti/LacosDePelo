import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
/* import { Button } from '../components/ui/Button'; */
import Navbar from '../components/Navbar';
import Loading from '../components/ui/Loading';
import { gql, useQuery } from '@apollo/client';

interface OrderLineItemEdge {
  node: {
    title: string;
    quantity: number;
    variant: {
      price: {
        amount: string;
      };
    };
  };
}

interface ShopifyOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  shippingAddress: {
    address1: string;
    city: string;
    provinceCode: string;
    zip: string;
  } | null;
  lineItems: {
    edges: OrderLineItemEdge[];
  };
}

// 1. DEFINIMOS A CONSULTA GRAPHQL PARA BUSCAR PEDIDOS
//    Ela espera uma variável '$customerAccessToken' para identificar o cliente.
const GET_CUSTOMER_ORDERS_QUERY = gql`
  query GetCustomerOrders($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            shippingAddress {
              address1
              city
              provinceCode
              zip
            }
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    price {
                      amount
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Função auxiliar para mapear o status da Shopify
const getStatusInfo = (financial: string, fulfillment: string) => {
  if (fulfillment === 'FULFILLED') {
    return { label: 'Entregue', color: 'bg-green-500', icon: CheckCircle };
  }
  if (fulfillment === 'IN_PROGRESS' || fulfillment === 'PARTIALLY_FULFILLED') {
    return { label: 'Em Trânsito', color: 'bg-blue-500', icon: Truck };
  }
  if (financial === 'PAID') {
    return { label: 'Processando', color: 'bg-yellow-500', icon: Clock };
  }
  return { label: 'Pendente', color: 'bg-gray-500', icon: Package };
};


const Orders = () => {
  const customerAccessToken = localStorage.getItem("shopify_token");
  const { loading, error, data } = useQuery(GET_CUSTOMER_ORDERS_QUERY, {
    variables: { customerAccessToken },
    skip: !customerAccessToken,
  });

  // 4. TRATAMOS OS ESTADOS DE CARREGAMENTO E ERRO
  if (loading) return <Loading message="Buscando seus pedidos..." />;

  // Se não estiver logado ou der erro
  if (!customerAccessToken || error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">
            {error ? error.message : "Você precisa fazer login para ver seus pedidos."}
          </p>
        </main>
      </div>
    );
  }

  const orders = data?.customer?.orders.edges || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Pedidos</h1>
          <p className="text-gray-600">Acompanhe o status das suas compras</p>
        </div>

        <div className="space-y-6">
          {/* 6. ADICIONAMOS A VERIFICAÇÃO PARA O CASO DE NÃO HAVER PEDIDOS */}
          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Você ainda não fez nenhum pedido.</p>
              </CardContent>
            </Card>
          ) : (
            orders.map(({ node: order }: { node: ShopifyOrder }) => {
              const statusInfo = getStatusInfo(order.financialStatus, order.fulfillmentStatus);
              const StatusIcon = statusInfo.icon;

              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-white border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">Pedido #{order.orderNumber}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Realizado em {new Date(order.processedAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className={`${statusInfo.color} text-white`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {order.totalPrice.amount} {order.totalPrice.currencyCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Itens do Pedido</h3>
                        <div className="space-y-3">
                          {order.lineItems.edges.map((itemEdge, index) => (
                            <div key={index} className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{itemEdge.node.title}</p>
                                <p className="text-xs text-gray-600">Quantidade: {itemEdge.node.quantity}</p>
                              </div>
                              <p className="text-sm font-medium text-gray-900 ml-4">
                                R$ {parseFloat(itemEdge.node.variant.price.amount).toFixed(2).replace('.', ',')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Entrega</h3>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress?.address1}, {order.shippingAddress?.city} - {order.shippingAddress?.provinceCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};


export default Orders;