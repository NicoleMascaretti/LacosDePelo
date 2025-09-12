const PoliticaDePrivacidade = () => {
  return (
    <div className="bg-gray-50">
      {/* <Navbar /> */}
      <div className="container mx-auto px-4 py-12 lg:py-20 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Política de Privacidade</h1>
        <p className="text-gray-500 mb-8">Última atualização: 12 de setembro de 2025</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>A sua privacidade é de extrema importância para a Laços de Pelo ([Nome da Empresa/Seu Nome]). Esta Política de Privacidade descreve como coletamos, usamos, compartilhamos e protegemos suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>

          <h2 className="text-2xl font-semibold text-gray-800 pt-4">1. Dados que Coletamos</h2>
          <p>Coletamos os seguintes tipos de informações:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Informações de Cadastro:</strong> Nome completo, e-mail, CPF, endereço de entrega e cobrança, e número de telefone.</li>
            <li><strong>Informações de Pagamento:</strong> Os dados do seu cartão de crédito são processados diretamente pelo nosso gateway de pagamento (Shopify Payments). Nós não armazenamos essas informações em nossos servidores.</li>
            <li><strong>Informações de Navegação:</strong> Endereço IP, tipo de navegador, informações sobre o dispositivo, páginas visitadas e tempo de permanência, através de cookies e tecnologias similares.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 pt-4">2. Finalidade da Coleta de Dados</h2>
          <p>Utilizamos seus dados para as seguintes finalidades:</p>
           <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Processar, faturar e entregar seu pedido.</li>
            <li>Comunicar-nos com você sobre o status do seu pedido.</li>
            <li>Enviar comunicações de marketing (e-mails, newsletters), caso você tenha consentido.</li>
            <li>Personalizar sua experiência de navegação e melhorar nosso site e serviços.</li>
            <li>Cumprir obrigações legais e fiscais.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 pt-4">3. Compartilhamento de Dados</h2>
          <p>Não vendemos suas informações pessoais. Podemos compartilhar seus dados com terceiros estritamente necessários para a operação do nosso negócio, incluindo:</p>
           <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Shopify:</strong> Nossa plataforma de e-commerce, que hospeda nossa loja.</li>
            <li><strong>Gateways de Pagamento:</strong> Para processar sua compra de forma segura.</li>
            <li><strong>Empresas de Logística e Transportadoras:</strong> Para realizar a entrega do seu pedido.</li>
            <li><strong>Ferramentas de Marketing:</strong> Apenas com seu consentimento explícito para o envio de comunicações.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 pt-4">4. Seus Direitos (LGPD)</h2>
          <p>Como titular dos dados, a LGPD garante a você diversos direitos, que podem ser exercidos a qualquer momento através do nosso canal de contato. Seus direitos incluem:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Confirmação da existência de tratamento de seus dados.</li>
            <li>Acesso aos seus dados.</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
            <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos.</li>
            <li>Portabilidade dos dados a outro fornecedor de serviço ou produto.</li>
            <li>Eliminação dos dados pessoais tratados com o consentimento do titular.</li>
            <li>Revogação do consentimento.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 pt-4">5. Segurança dos Dados</h2>
          <p>Adotamos medidas de segurança técnicas e administrativas para proteger seus dados pessoais de acessos não autorizados e de situações de destruição, perda ou alteração. Nosso site utiliza criptografia SSL para proteger as informações durante a transmissão.</p>

          <h2 className="text-2xl font-semibold text-gray-800 pt-4">6. Cookies</h2>
          <p>Utilizamos cookies para melhorar a funcionalidade do site, analisar o tráfego e personalizar o conteúdo. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.</p>
          
          <h2 className="text-2xl font-semibold text-gray-800 pt-4">7. Contato</h2>
          <p>Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco através do e-mail: [lacosdepelo.atendimento@gmail.com].</p>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default PoliticaDePrivacidade;