import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { shopifyClient } from "../lib/shopifyClient";

type LoginFormData = {
  email: string;
  password: string;
};

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// --- Storefront API mutations ---
const CUSTOMER_ACCESS_TOKEN_CREATE = gql`
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMER_CREATE = gql`
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;

const Login = () => {
  const navigate = useNavigate();

  // visibilidade senhas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // estados de loading/erro
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // form login
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({ mode: "onSubmit" });

  // form cadastro
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    watch,
    trigger,
    formState: { errors: registerErrors, isValid },
  } = useForm<RegisterFormData>({ mode: "onChange" });

  const password = watch("password");

  useEffect(() => {
    // revalida confirmação ao digitar senha
    trigger("confirmPassword");
  }, [password, trigger]);

  // --- handlers ---
  const onLogin = async (data: LoginFormData) => {
    setLoginError(null);
    setLoginLoading(true);
    try {
      const res = await shopifyClient.mutate({
        mutation: CUSTOMER_ACCESS_TOKEN_CREATE,
        variables: {
          input: { email: data.email, password: data.password },
        },
      });

      const result = res.data?.customerAccessTokenCreate;
      const token = result?.customerAccessToken?.accessToken;
      const errMsg = result?.customerUserErrors?.[0]?.message;

      if (token) {
        localStorage.setItem("shopify_token", token);
        navigate("/"); // redireciona após login
      } else {
        setLoginError(errMsg || "Não foi possível fazer login. Verifique suas credenciais.");
      }
    } catch (err: any) {
      setLoginError(err?.message || "Erro inesperado ao fazer login.");
    } finally {
      setLoginLoading(false);
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    setRegisterError(null);
    setRegisterLoading(true);
    try {
      // 1) Criar cliente
      const created = await shopifyClient.mutate({
        mutation: CUSTOMER_CREATE,
        variables: {
          input: { firstName: data.name, email: data.email, password: data.password },
        },
      });

      const createErrors = created.data?.customerCreate?.customerUserErrors;
      if (createErrors && createErrors.length) {
        setRegisterError(createErrors.map((e: any) => e.message).join(", "));
        setRegisterLoading(false);
        return;
      }

      // 2) Auto-login
      const loginRes = await shopifyClient.mutate({
        mutation: CUSTOMER_ACCESS_TOKEN_CREATE,
        variables: {
          input: { email: data.email, password: data.password },
        },
      });

      const token = loginRes.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
      const loginErr = loginRes.data?.customerAccessTokenCreate?.customerUserErrors?.[0]?.message;

      if (token) {
        localStorage.setItem("shopify_token", token);
        navigate("/"); // redireciona após cadastro + login
      } else {
        setRegisterError(loginErr || "Conta criada, mas não foi possível efetuar o login automaticamente.");
      }
    } catch (err: any) {
      setRegisterError(err?.message || "Erro inesperado ao criar conta.");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 grid place-items-center px-4">
      <main className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar à loja
            </Link>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">Minha Conta</CardTitle>
              <CardDescription>Faça login ou crie sua conta para continuar</CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="register">Criar Conta</TabsTrigger>
                </TabsList>

                {/* LOGIN */}
                <TabsContent value="login" className="space-y-4 mt-6">
                  <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        {...loginRegister("email", {
                          required: "Email é obrigatório",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Email inválido",
                          },
                        })}
                      />
                      {loginErrors.email && (
                        <p className="text-sm text-red-600">{loginErrors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Sua senha"
                          {...loginRegister("password", {
                            required: "Senha é obrigatória",
                            minLength: {
                              value: 6,
                              message: "Senha deve ter pelo menos 6 caracteres",
                            },
                          })}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      {loginErrors.password && (
                        <p className="text-sm text-red-600">{loginErrors.password.message}</p>
                      )}
                    </div>

                    {/* Erro geral de login */}
                    {loginError && <p className="text-sm text-red-600">{loginError}</p>}

                    <div className="flex items-center justify-between">
                      <Button type="button" variant="link" className="px-0 text-sm text-teal-600">
                        Esqueceu sua senha?
                      </Button>
                    </div>

                    <Button type="submit" className="w-full" disabled={loginLoading}>
                      {loginLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </TabsContent>

                {/* REGISTER */}
                <TabsContent value="register" className="space-y-4 mt-6">
                  <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nome completo</Label>
                      <Input
                        id="register-name"
                        placeholder="Seu nome completo"
                        {...registerRegister("name", {
                          required: "Nome é obrigatório",
                          minLength: {
                            value: 2,
                            message: "Nome deve ter pelo menos 2 caracteres",
                          },
                        })}
                      />
                      {registerErrors.name && (
                        <p className="text-sm text-red-600">{registerErrors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        {...registerRegister("email", {
                          required: "Email é obrigatório",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Email inválido",
                          },
                        })}
                      />
                      {registerErrors.email && (
                        <p className="text-sm text-red-600">{registerErrors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Escolha uma senha"
                          {...registerRegister("password", {
                            required: "Senha é obrigatória",
                            minLength: {
                              value: 6,
                              message: "Senha deve ter pelo menos 6 caracteres",
                            },
                          })}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      {registerErrors.password && (
                        <p className="text-sm text-red-600">{registerErrors.password.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Confirmar senha</Label>
                      <div className="relative">
                        <Input
                          id="register-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Digite a senha novamente"
                          {...registerRegister("confirmPassword", {
                            required: "Confirmação obrigatória",
                            validate: (value) => value === password || "Senhas não coincidem",
                          })}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      {registerErrors.confirmPassword && (
                        <p className="text-sm text-red-600">{registerErrors.confirmPassword.message}</p>
                      )}
                    </div>

                    {/* Erro geral de cadastro */}
                    {registerError && <p className="text-sm text-red-600">{registerError}</p>}

                    <Button type="submit" className="w-full" disabled={registerLoading || !isValid}>
                      {registerLoading ? "Criando conta..." : "Criar conta"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Ao criar uma conta, você concorda com nossos</p>
            <div className="space-x-1">
              <Button asChild variant="link" className="p-0 h-auto text-sm text-teal-600">
                <Link to="/termos-de-uso">Termos de Uso</Link>
              </Button>
              <span>e</span>
              <Button asChild variant="link" className="p-0 h-auto text-sm text-teal-600">
                <Link to="/politica-de-privacidade">Política de Privacidade</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
