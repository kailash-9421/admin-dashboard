import api from "../lib/axios";

export async function getProducts({ limit, skip, search, category, sortBy, order, signal }) {
  const path = search ? "/products/search" : category ? `/products/category/${encodeURIComponent(category)}` : "/products";
  const { data } = await api.get(path, {
    params: { ...(search ? { q: search } : {}), limit, skip, ...(sortBy ? { sortBy, order } : {}) },
    signal
  });
  return data;
}

export async function getCategories() {
  const { data } = await api.get("/products/categories");
  return data;
}

export async function getProductById(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

export async function addProduct(product) {
  const { data } = await api.post("/products/add", product);
  return data;
}

export async function updateProduct(id, product) {
  const { data } = await api.put(`/products/${id}`, product);
  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}
