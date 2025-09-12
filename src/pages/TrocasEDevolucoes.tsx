import { Link } from 'react-router-dom';

const TrocasEDevolucoes = () => {
  return (
    <div className="bg-gray-50">
      {/* <Navbar /> */}
      <div className="container mx-auto px-4 py-12 lg:py-20 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Trocas e Devoluções</h1>
        <p className="text-gray-500 mb-8">Última atualização: 12 de setembro de 2025</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Na Laços de Pelo, queremos que sua experiência de compra seja incrível do início ao fim. Por isso, criamos uma política de trocas e devoluções simples e transparente, baseada no Código de Defesa do Consumidor.</p>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Arrependimento da Compra (Devolução)</h2>
            <p className="mb-4">Você comprou um produto e, ao recebê-lo, percebeu que não era o que esperava ou simplesmente mudou de ideia? Sem problemas!</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Prazo:</strong> Você tem até 7 (sete) dias corridos, contados a partir da data de recebimento do produto, para solicitar a devolução por arrependimento.</li>
              <li><strong>Condições:</strong> O produto deve ser devolvido em sua embalagem original, sem indícios de uso, sem violação do lacre original do fabricante, e acompanhado de todos os seus acessórios e manuais.</li>
              <li><strong>Reembolso:</strong> Caso a devolução seja aprovada, o valor total da compra (produto + frete original) será reembolsado. O custo do frete de devolução é por nossa conta.</li>
            </ul>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Produto com Defeito (Troca por Garantia)</h2>
            <p className="mb-4">Se o produto que você recebeu apresentar algum defeito de fabricação, você tem o direito de solicitar a troca.</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Prazo:</strong> Você deve entrar em contato conosco em até **30 (trinta) dias corridos** após o recebimento para produtos não duráveis (como petiscos) ou **90 (noventa) dias corridos** para produtos duráveis (como brinquedos e coleiras).</li>
              <li><strong>Processo:</strong> Após o seu contato, forneceremos as instruções para o envio do produto. Faremos uma análise técnica e, se o defeito for constatado, você poderá optar por:
                <ul className="list-['-_'] list-inside space-y-1 pl-6 mt-2">
                  <li>Trocar por um produto novo e idêntico.</li>
                  <li>Receber o reembolso integral do valor pago.</li>
                  <li>Receber um vale-compras no mesmo valor para usar em nosso site.</li>
                </ul>
              </li>
               <li><strong>Frete:</strong> Todos os custos de frete envolvidos na troca por defeito são de nossa responsabilidade.</li>
            </ul>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Troca por Outro Produto (Tamanho, cor, etc.)</h2>
            <p className="mb-4">Comprou uma roupinha e o tamanho não serviu? Quer trocar por outra cor? Nós te ajudamos!</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Prazo:</strong> Você pode solicitar a troca em até 30 (trinta) dias corridos após o recebimento.</li>
              <li><strong>Condições:</strong> O produto deve estar em perfeito estado, sem indícios de uso, com as etiquetas e em sua embalagem original.</li>
              <li><strong>Frete da Troca:</strong> Nesta modalidade, o frete para enviar o produto de volta para a Laços de Pelo é de responsabilidade do cliente. O frete para o envio do novo produto escolhido é por nossa conta (válido para a primeira troca).</li>
              <li><strong>Disponibilidade:</strong> A troca estará sujeita à disponibilidade de estoque do novo produto desejado.</li>
            </ul>
          </div>

          <div className="p-6 bg-teal-50 border-l-4 border-teal-500 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Como Solicitar sua Troca ou Devolução</h2>
            <p className="mb-4">O processo é simples e rápido:</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Envie um e-mail para [lacosdepelo.atendimento@gmail.com] com o assunto "Troca" ou "Devolução".</li>
              <li>No corpo do e-mail, informe:
                <ul className="list-['-_'] list-inside space-y-1 pl-6 mt-2">
                  <li>Seu nome completo</li>
                  <li>Número do pedido</li>
                  <li>Nome do produto que deseja trocar ou devolver</li>
                  <li>Motivo da troca ou devolução</li>
                </ul>
              </li>
              <li>Aguarde nosso retorno. Em até 2 dias úteis, responderemos com todas as instruções para o envio do produto.</li>
            </ol>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 pt-4">Dúvidas?</h2>
          <p>Se você tiver qualquer outra dúvida, por favor, entre em contato conosco através da nossa página de <Link to="/contato" className="text-teal-600 hover:underline">Contato</Link>.</p>

        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default TrocasEDevolucoes;