import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getProductos, createProducto, updateProducto, deleteProducto, getCategorias, getIngredientes } from '../api/api'
import type { Producto, ProductoCreate } from '../api/api'

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
  const abrirEditar = (p: Producto) => { setEditando(p); setForm({ nombre: p.nombre, precio: p.precio, descripcion: p.descripcion || '', categoria_id: p.categoria_id, ingrediente_ids: [] }); setModalOpen(true) }
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

  const getNombreCategoria = (id?: number) => categorias?.find(c => c.id === id)?.nombre || '-'

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
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos?.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.id}</td>
              <td className="p-3">{p.nombre}</td>
              <td className="p-3">${p.precio}</td>
              <td className="p-3">{getNombreCategoria(p.categoria_id)}</td>
              <td className="p-3 flex gap-2">
                <Link to={`/productos/${p.id}`} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">Ver</Link>
                <button onClick={() => abrirEditar(p)} className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500">Editar</button>
                <button onClick={() => eliminarMutation.mutate(p.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editando ? 'Editar' : 'Nuevo'} Producto</h2>
            <input className="w-full border p-2 rounded mb-3" placeholder="Nombre" value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })} />
            <input className="w-full border p-2 rounded mb-3" placeholder="Precio" type="number" value={form.precio}
              onChange={e => setForm({ ...form, precio: parseFloat(e.target.value) })} />
            <input className="w-full border p-2 rounded mb-3" placeholder="Descripción" value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })} />
            <select className="w-full border p-2 rounded mb-3" value={form.categoria_id || ''}
              onChange={e => setForm({ ...form, categoria_id: e.target.value ? parseInt(e.target.value) : undefined })}>
              <option value="">Sin categoría</option>
              {categorias?.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <p className="font-semibold mb-2">Ingredientes:</p>
            {ingredientes?.map(i => (
              <label key={i.id} className="flex items-center gap-2 mb-1">
                <input type="checkbox" checked={form.ingrediente_ids.includes(i.id)}
                  onChange={() => toggleIngrediente(i.id)} />
                {i.nombre} ({i.unidad})
              </label>
            ))}
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={cerrarModal} className="px-4 py-2 border rounded">Cancelar</button>
              <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {editando ? 'Guardar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}