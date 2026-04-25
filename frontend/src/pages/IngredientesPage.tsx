import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getIngredientes, createIngrediente, updateIngrediente, deleteIngrediente } from '../api/api'
import type { Ingrediente, IngredienteCreate } from '../api/api'

export default function IngredientesPage() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Ingrediente | null>(null)
  const [form, setForm] = useState<IngredienteCreate>({ nombre: '', unidad: '' })

  const { data: ingredientes, isLoading, isError } = useQuery({
    queryKey: ['ingredientes'],
    queryFn: getIngredientes,
  })

  const crearMutation = useMutation({
    mutationFn: createIngrediente,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ingredientes'] }); cerrarModal() },
  })

  const editarMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: IngredienteCreate }) => updateIngrediente(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ingredientes'] }); cerrarModal() },
  })

  const eliminarMutation = useMutation({
    mutationFn: deleteIngrediente,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredientes'] }),
  })

  const abrirCrear = () => { setEditando(null); setForm({ nombre: '', unidad: '' }); setModalOpen(true) }
  const abrirEditar = (i: Ingrediente) => { setEditando(i); setForm({ nombre: i.nombre, unidad: i.unidad }); setModalOpen(true) }
  const cerrarModal = () => { setModalOpen(false); setEditando(null) }

  const handleSubmit = () => {
    if (editando) editarMutation.mutate({ id: editando.id, data: form })
    else crearMutation.mutate(form)
  }

  if (isLoading) return <p className="text-center mt-10">Cargando...</p>
  if (isError) return <p className="text-center mt-10 text-red-500">Error al cargar ingredientes</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Ingredientes</h1>
        <button onClick={abrirCrear} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Nuevo</button>
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Unidad</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ingredientes?.map(i => (
            <tr key={i.id} className="border-t">
              <td className="p-3">{i.id}</td>
              <td className="p-3">{i.nombre}</td>
              <td className="p-3">{i.unidad}</td>
              <td className="p-3 flex gap-2">
                <button onClick={() => abrirEditar(i)} className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500">Editar</button>
                <button onClick={() => eliminarMutation.mutate(i.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">{editando ? 'Editar' : 'Nuevo'} Ingrediente</h2>
            <input className="w-full border p-2 rounded mb-3" placeholder="Nombre" value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })} />
            <input className="w-full border p-2 rounded mb-3" placeholder="Unidad (ej: kg, lt, g)" value={form.unidad}
              onChange={e => setForm({ ...form, unidad: e.target.value })} />
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