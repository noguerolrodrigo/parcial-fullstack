import { useState, useEffect } from 'react'
import type { Producto, ProductoCreate } from '../types/producto'
import type { Categoria } from '../types/categoria'
import type { Ingrediente } from '../types/ingrediente'

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editando: Producto | null;
  form: ProductoCreate;
  setForm: (form: any) => void;
  onSubmit: () => void;
  categorias?: Categoria[];
  ingredientes?: Ingrediente[];
  toggleIngrediente: (id: number) => void;
}

export default function ProductoModal({ isOpen, onClose, editando, form, setForm, onSubmit, categorias, ingredientes, toggleIngrediente }: Props) {
  
  // Guardamos qué Categoría seleccionó para poder mostrarle sus Subcategorías
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | ''>('');

  // Se ejecuta SOLO al abrir el modal para cargar los datos si estamos editando
  // (Le sacamos el bug que reiniciaba todo al hacer clic)
  useEffect(() => {
    if (isOpen) {
      if (editando && categorias && form.categoria_id) {
        const catActual = categorias.find(c => c.id === form.categoria_id);
        if (catActual?.parent_id) {
          setCategoriaSeleccionada(catActual.parent_id);
        } else {
          setCategoriaSeleccionada(catActual?.id || '');
        }
      } else {
        setCategoriaSeleccionada('');
      }
    }
  }, [isOpen, editando, categorias]);

  if (!isOpen) return null;

  // Filtramos las categorías "Padre" (las que no tienen parent_id)
  const categoriasPrincipales = categorias?.filter(c => !c.parent_id) || [];
  
  // Filtramos las Subcategorías que pertenecen al Padre seleccionado
  const subcategorias = categorias?.filter(c => c.parent_id === categoriaSeleccionada) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{editando ? 'Editar' : 'Nuevo'} Producto</h2>
        
        <input className="w-full border p-2 rounded mb-3" placeholder="Nombre" value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })} />
        
        <input className="w-full border p-2 rounded mb-3" placeholder="Precio" type="number" value={form.precio}
          onChange={e => setForm({ ...form, precio: parseFloat(e.target.value) })} />
        
        <input className="w-full border p-2 rounded mb-3" placeholder="Descripción" value={form.descripcion}
          onChange={e => setForm({ ...form, descripcion: e.target.value })} />
        
        {/* SELECTOR 1: Categoría */}
        <p className="font-semibold mb-1 text-sm text-gray-600">Categoría:</p>
        <select 
          className="w-full border p-2 rounded mb-3" 
          value={categoriaSeleccionada}
          onChange={e => {
            const val = e.target.value ? parseInt(e.target.value) : '';
            setCategoriaSeleccionada(val);
            // Guardamos esta categoría en el producto (por si no elige ninguna subcategoría)
            setForm({ ...form, categoria_id: val || undefined });
          }}
        >
          <option value="">Seleccionar categoría...</option>
          {categoriasPrincipales.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>

        {/* SELECTOR 2: Subcategoría (Solo se muestra si la categoría elegida tiene hijos) */}
        {categoriaSeleccionada !== '' && subcategorias.length > 0 && (
          <>
            <p className="font-semibold mb-1 text-sm text-gray-600">Subcategoría:</p>
            <select 
              className="w-full border p-2 rounded mb-3" 
              // Si el ID del producto es el mismo que el del Padre, significa que aún no eligió subcategoría
              value={form.categoria_id === categoriaSeleccionada ? '' : form.categoria_id || ''}
              onChange={e => {
                // Si elige "Sin subcategoría", le volvemos a asignar el ID de la categoría Padre
                const val = e.target.value ? parseInt(e.target.value) : categoriaSeleccionada;
                setForm({ ...form, categoria_id: val });
              }}
            >
              <option value="">Sin subcategoría</option>
              {subcategorias.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </>
        )}
        
        <p className="font-semibold mt-2 mb-2">Ingredientes:</p>
        {ingredientes?.map(i => (
          <label key={i.id} className="flex items-center gap-2 mb-1">
            <input type="checkbox" checked={form.ingrediente_ids.includes(i.id)}
              onChange={() => toggleIngrediente(i.id)} />
            {i.nombre} ({i.unidad})
          </label>
        ))}
        
        <div className="flex gap-2 justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
          <button onClick={onSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editando ? 'Guardar' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  )
}