import axios from 'axios'
import type { Categoria, CategoriaCreate, Ingrediente, IngredienteCreate, Producto, ProductoCreate } from '../types';

const api = axios.create({ baseURL: 'http://127.0.0.1:8000' })

export const getCategorias = () => api.get<Categoria[]>('/categorias/').then(r => r.data)
export const createCategoria = (data: CategoriaCreate) => api.post<Categoria>('/categorias/', data).then(r => r.data)
export const updateCategoria = (id: number, data: CategoriaCreate) => api.put<Categoria>('/categorias/' + id, data).then(r => r.data)
export const deleteCategoria = (id: number) => api.delete('/categorias/' + id)

export const getIngredientes = () => api.get<Ingrediente[]>('/ingredientes/').then(r => r.data)
export const createIngrediente = (data: IngredienteCreate) => api.post<Ingrediente>('/ingredientes/', data).then(r => r.data)
export const updateIngrediente = (id: number, data: IngredienteCreate) => api.put<Ingrediente>('/ingredientes/' + id, data).then(r => r.data)
export const deleteIngrediente = (id: number) => api.delete('/ingredientes/' + id)

export const getProductos = () => api.get<Producto[]>('/productos/').then(r => r.data)
export const getProducto = (id: number) => api.get<Producto>('/productos/' + id).then(r => r.data)
export const createProducto = (data: ProductoCreate) => api.post<Producto>('/productos/', data).then(r => r.data)
export const updateProducto = (id: number, data: ProductoCreate) => api.put<Producto>('/productos/' + id, data).then(r => r.data)
export const deleteProducto = (id: number) => api.delete('/productos/' + id)