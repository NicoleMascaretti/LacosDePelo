export const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .normalize("NFD")               // separa acentos
    .replace(/[\u0300-\u036f]/g, "")// remove acentos
    .replace(/&/g, "e")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");

export const deslugify = (slug: string) =>
  slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase()); // opcional: só para exibir algo legível
