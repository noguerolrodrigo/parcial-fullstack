export interface Categoria { 
    id: number; 
    nombre: string; 
    descripcion?: string;
    parent_id?: number; 
}
export interface CategoriaCreate { 
    nombre: string; 
    descripcion?: string; 
    parent_id?: number;
}