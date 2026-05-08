import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { getProductos, createProducto, updateProducto, deleteProducto } from '../api/productos'
import { getCategorias } from '../api/categorias'
import { getIngredientes } from '../api/ingredientes'
import type { Producto, ProductoCreate } from '../types/producto'

import ProductoModal from '../components/ProductoModal'

export default function ProductosPage() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Producto | null>(null)
  const [form, setForm] = useState<ProductoCreate>({ nombre: '', precio: 0, descripcion: '', categoria_id: undefined, ingrediente_ids: [] })

  const { data: productos, isLoading, isError } = useQuery({ queryKey: ['productos'], queryFn: getProductos })
  const { data: categorias } = useQuery({ queryKey: ['categorias'], queryFn: getCategorias })
  const { data: ingredientes } = useQuery({ queryKey: ['ingredientes'], queryFn: getIngredientes })

  const crearMutation = useMutation({
    mutationFn: createProducto,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['productos'] }); cerrarModal() },
  })

  const editarMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductoCreate }) => updateProducto(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['productos'] }); cerrarModal() },
  })

  const eliminarMutation = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] }),
  })

  const abrirCrear = () => { setEditando(null); setForm({ nombre: '', precio: 0, descripcion: '', categoria_id: undefined, ingrediente_ids: [] }); setModalOpen(true) }
  const abrirEditar = (p: any) => {
    setEditando(p);
    setForm({
        nombre: p.nombre,
        precio: p.precio,
        descripcion: p.descripcion || '',
        categoria_id: p.categoria_id,
        ingrediente_ids: p.ingredientes ? p.ingredientes.map((i: any) => i.id) : []
    });
    setModalOpen(true);
  }
  const cerrarModal = () => { setModalOpen(false); setEditando(null) }

  const toggleIngrediente = (id: number) => {
    setForm(f => ({
      ...f,
      ingrediente_ids: f.ingrediente_ids.includes(id) ? f.ingrediente_ids.filter(i => i !== id) : [...f.ingrediente_ids, id]
    }))
  }

  const handleSubmit = () => {
    if (editando) editarMutation.mutate({ id: editando.id, data: form })
    else crearMutation.mutate(form)
  }

  // --- NUEVAS FUNCIONES PARA SEPARAR CATEGORÍA Y SUBCATEGORÍA ---
  const getCategoriaPrincipal = (id?: number) => {
    const cat = categorias?.find(c => c.id === id);
    if (!cat) return '-';
    // Si la categoría tiene un padre, mostramos el nombre del padre
    if (cat.parent_id) {
      const padre = categorias?.find(p => p.id === cat.parent_id);
      return padre ? padre.nombre : '-';
    }
    // Si no tiene padre, ella misma es la principal
    return cat.nombre;
  }

  const getSubcategoria = (id?: number) => {
    const cat = categorias?.find(c => c.id === id);
    if (!cat) return '-';
    // Si tiene padre, significa que ella es la subcategoría
    if (cat.parent_id) {
      return cat.nombre;
    }
    // Si no tiene padre, no hay subcategoría
    return '-';
  }

  if (isLoading) return <p className="text-center mt-10">Cargando...</p>
  if (isError) return <p className="text-center mt-10 text-red-500">Error al cargar productos</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Productos</h1>
        <button onClick={abrirCrear} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Nuevo</button>
      </div>
      
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Precio</th>
            <th className="p-3 text-left">Categoría</th>
            <th className="p-3 text-left">Subcategoría</th>
            <th className="p-3 text-left">Ingredientes</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos?.map((p: any) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.id}</td>
              <td className="p-3">{p.nombre}</td>
              <td className="p-3">${p.precio}</td>
              <td className="p-3">{getCategoriaPrincipal(p.categoria_id)}</td>
              <td className="p-3">{getSubcategoria(p.categoria_id)}</td>
              <td className="p-3">
                {p.ingredientes && p.ingredientes.length > 0 
                  ? p.ingredientes.map((i: any) => i.nombre).join(', ') 
                  : '-'}
              </td>
              <td className="p-3 flex gap-2">
                <Link to={`/productos/${p.id}`} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">Ver</Link>
                <button onClick={() => abrirEditar(p)} className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500">Editar</button>
                <button onClick={() => eliminarMutation.mutate(p.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ProductoModal 
        isOpen={modalOpen} 
        onClose={cerrarModal} 
        editando={editando} 
        form={form} 
        setForm={setForm} 
        onSubmit={handleSubmit} 
        categorias={categorias} 
        ingredientes={ingredientes} 
        toggleIngrediente={toggleIngrediente} 
      />
    </div>
  )
}