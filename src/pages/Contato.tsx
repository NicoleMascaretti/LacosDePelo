import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Navbar from '../components/Navbar';
import Footer from '../components/ui/Footer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/TextArea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/Form';
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  subject: z.string().min(5, 'Assunto deve ter pelo menos 5 caracteres'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres')
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contato = () => {
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = (data: ContactFormData) => {
    console.log('Contact form submitted:', data);
    toast({
      title: "Mensagem enviada!",
      description: "Recebemos sua mensagem e responderemos em breve.",
    });
    form.reset();
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Telefone',
      info: '(11) 99598-4383',
      description: 'Segunda a Sexta, 8h às 18h'
    },
    {
      icon: Mail,
      title: 'E-mail',
      info: 'lacosdepelo.atendimento@gmail.com',
      description: 'Resposta em até 24h'
    },
    {
      icon: MapPin,
      title: 'Endereço',
      info: 'São Caetano do Sul',
      description: 'Entrega em toda região'
    },
    // {
    //   icon: Clock,
    //   title: 'Horário de Funcionamento',
    //   info: 'Segunda a Sexta: 8h às 18h',
    //   description: 'Sábado: 9h às 15h'
    // }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Entre em <span className="text-orange-300">Contato</span>
          </h1>
          <p className="text-xl lg:text-2xl text-teal-100 max-w-3xl mx-auto leading-relaxed">
            Estamos aqui para ajudar você e seu pet! Entre em contato conosco através dos canais abaixo.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl text-center shadow-lg">
                <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-lg text-gray-800 mb-1">
                  {info.info}
                </p>
                <p className="text-gray-600 text-sm">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg h-fit">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Envie sua Mensagem
                </h2>
                <p className="text-gray-600">
                  Preencha o formulário abaixo e entraremos em contato o mais rápido possível.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(11) 99999-9999" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="seu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assunto</FormLabel>
                        <FormControl>
                          <Input placeholder="Como podemos ajudar?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Conte-nos mais sobre sua necessidade..."
                            className="min-h-[120px] resize-none"
                            maxLength={500}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 text-lg"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Enviar Mensagem
                  </Button>
                </form>
              </Form>
            </div>

            {/* Map and Additional Info */}
            <div className="space-y-8">
              {/* Mapa do Google */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* O iframe colado aqui, com a correção de estilo */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.2486411624036!2d-46.554234199999996!3d-23.631265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5d2a6d7e51af%3A0xb7c2950f785437c!2sR.%20Teff%C3%A9%2C%20455%20-%20Santa%20Maria%2C%20S%C3%A3o%20Caetano%20do%20Sul%20-%20SP%2C%2009560-140!5e0!3m2!1spt-BR!2sbr!4v1759364914878!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nossa Localização
                  </h3>
                  <p className="text-gray-600">
                    Atendemos toda a região de São Paulo com entregas rápidas e seguras para seu pet.
                  </p>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 rounded-2xl text-white">
                <div className="flex items-center mb-4">
                  <MessageCircle className="h-8 w-8 mr-3" />
                  <h3 className="text-2xl font-bold">Atendimento Rápido</h3>
                </div>
                <p className="mb-6 text-green-100">
                  Precisa de ajuda urgente? Fale conosco pelo WhatsApp e receba atendimento imediato!
                </p>
                <a
                  href="https://wa.me/5511995984383?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
                  target="_blank"
                  rel="noopener noreferrer"
                  // Classes para fazer o link se parecer com o botão
                  className="inline-flex items-center justify-center rounded-md px-6 py-3 bg-white text-green-600 hover:bg-gray-100 font-semibold transition-colors"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Falar no WhatsApp
                </a>
              </div>

              {/* FAQ Quick Links */}
{/*               <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Dúvidas Frequentes
                </h3>
                <div className="space-y-3">
                  <a href="#" className="block text-teal-600 hover:text-teal-700 transition-colors">
                    → Como funciona a entrega?
                  </a>
                  <a href="#" className="block text-teal-600 hover:text-teal-700 transition-colors">
                    → Política de trocas e devoluções
                  </a>
                  <a href="#" className="block text-teal-600 hover:text-teal-700 transition-colors">
                    → Produtos em falta
                  </a>
                  <a href="#" className="block text-teal-600 hover:text-teal-700 transition-colors">
                    → Formas de pagamento
                  </a>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contato;