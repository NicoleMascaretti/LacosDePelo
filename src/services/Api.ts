import type { ProductType } from "../types/ProductType";

export async function fetchProducts(): Promise<ProductType[]> {
  const res = await fetch("http://localhost:8080/products");
  if (!res.ok) throw new Error("Erro ao buscar produtos");
  return res.json();
}
export async function fetchProductById(id: number): Promise<ProductType> {
  const res = await fetch(`http://localhost:8080/products/${id}`);
  if (!res.ok) throw new Error("Produto não encontrado");
  return res.json();
}