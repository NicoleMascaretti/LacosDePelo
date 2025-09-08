import { useState } from "react";
import { gql, useMutation } from "@apollo/client";

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

export function useAuthShopify() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [createCustomer] = useMutation(CUSTOMER_CREATE);
  const [createToken] = useMutation(CUSTOMER_ACCESS_TOKEN_CREATE);

  // 🔹 Login normal
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await createToken({
        variables: { input: { email, password } },
      });

      const token = data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;

      if (token) {
        localStorage.setItem("shopify_token", token);
        return true;
      } else {
        setError(data?.customerAccessTokenCreate?.customerUserErrors?.[0]?.message || "Erro no login");
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Registro + auto-login
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Criar conta
      const { data } = await createCustomer({
        variables: { input: { firstName: name, email, password } },
      });

      if (data?.customerCreate?.customerUserErrors?.length > 0) {
        setError(data.customerCreate.customerUserErrors[0].message);
        return false;
      }

      // 2. Auto-login
      return await login(email, password);
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("shopify_token");
  };

  return { login, register, logout, error, loading };
}
