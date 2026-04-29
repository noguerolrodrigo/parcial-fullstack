import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../api/api'
import type { Categoria, CategoriaCreate } from '../types'

export default function CategoriasPage() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Categoria | null>(null)
  const [form, setForm] = useState<CategoriaCreate>({ nombre: '', descripcion: '' })

  const { data: categorias, isLoading, isError } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias,
  })

  const crearMutation = useMutation({
    mutationFn: createCategoria,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categorias'] }); cerrarModal() },
  })

  const editarMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoriaCreate }) => updateCategoria(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categorias'] }); cerrarModal() },
  })

  const eliminarMutation = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categorias'] }),
  })

  const abrirCrear = () => { setEditando(null); setForm({ nombre: '', descripcion: '' }); setModalOpen(true) }
  const abrirEditar = (c: Categoria) => { setEditando(c); setForm({ nombre: c.nombre, descripcion: c.descripcion || '' }); setModalOpen(true) }
  const cerrarModal = () => { setModalOpen(false); setEditando(null) }

  const handleSubmit = () => {
    if (editando) editarMutation.mutate({ id: editando.id, data: form })
    else crearMutation.mutate(form)
  }

  if (isLoading) return <p className="text-center mt-10">Cargando...</p>
  if (isError) return <p className="text-center mt-10 text-red-500">Error al cargar categorías</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <button onClick={abrirCrear} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Nueva</button>
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Descripción</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias?.map(c => (
            <tr key={c.id} className="border-t">
              <td className="p-3">{c.id}</td>
              <td className="p-3">{c.nombre}</td>
              <td className="p-3">{c.descripcion}</td>
              <td className="p-3 flex gap-2">
                <button onClick={() => abrirEditar(c)} className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500">Editar</button>
                <button onClick={() => eliminarMutation.mutate(c.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">{editando ? 'Editar' : 'Nueva'} Categoría</h2>
            <input className="w-full border p-2 rounded mb-3" placeholder="Nombre" value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })} />
            <input className="w-full border p-2 rounded mb-3" placeholder="Descripción" value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })} />
            <div className="flex gap-2 justify-end">
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