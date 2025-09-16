import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { accountLoginUrl } from "../lib/shopifyAccounts";

export default function Login() {
  const [email, setEmail] = useState("");
  const location = useLocation();

  const handleContinue = () => {
    // opcional: você pode anexar ?email= para pré-preencher (Shopify pode ignorar)
    const retTo = window.location.origin + (location.state?.returnTo || "/");
    window.location.href = accountLoginUrl(retTo);
  };

  return (
    <div className="min-h-screen bg-gray-50 grid place-items-center px-4">
      <main className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar à loja
            </Link>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">Minha Conta</CardTitle>
              <CardDescription>Digite seu e-mail para receber um código de acesso</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Você receberá um <strong>código de 6 dígitos</strong> para confirmar o acesso.
                  </p>
                </div>

                <Button className="w-full" onClick={handleContinue} disabled={!email}>
                  Continuar
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Ao continuar, você concorda com nossos{" "}
                  <Link to="/termos-de-uso" className="text-teal-600 hover:underline">Termos</Link> e{" "}
                  <Link to="/politica-de-privacidade" className="text-teal-600 hover:underline">Privacidade</Link>.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
