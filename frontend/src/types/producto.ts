export interface Producto { 
    id: number; 
    nombre: string; 
    precio: number; 
    descripcion?: string; 
    categoria_id?: number; 
}
export interface ProductoCreate { 
    nombre: string; 
    precio: number; 
    descripcion?: string; 
    categoria_id?: number; 
    ingrediente_ids: number[]; 
}