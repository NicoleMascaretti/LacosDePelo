import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const shopifyClient = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_SHOPIFY_GRAPHQL_ENDPOINT,
    headers: {
      "X-Shopify-Storefront-Access-Token": import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
      "Content-Type": "application/json",
    },
  }),
  cache: new InMemoryCache(),
});
