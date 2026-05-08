import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProducto } from '../api/productos'
import { getCategorias } from '../api/categorias'

export default function ProductoDetalle() {
  const { id } = useParams()
  
  // Traemos el producto específico
  const { data: producto, isLoading: loadingProd, isError: errorProd } = useQuery({ 
    queryKey: ['producto', id], 
    queryFn: () => getProducto(Number(id)) 
  })

  // Traemos las categorías para poder buscar quién es el padre
  const { data: categorias } = useQuery({ 
    queryKey: ['categorias'], 
    queryFn: getCategorias 
  })

  if (loadingProd) return <p className="text-center mt-10">Cargando...</p>
  if (errorProd) return <p className="text-center mt-10 text-red-500">Error al cargar el producto</p>
  if (!producto) return <p className="text-center mt-10">Producto no encontrado</p>

  // Lógica para separar Categoría Principal y Subcategoría
  let categoriaPrincipal = '-';
  let subcategoria = '-';

  if (producto.categoria_id && categorias) {
    const cat = categorias.find(c => c.id === producto.categoria_id);
    if (cat) {
      if (cat.parent_id) {
        // Si tiene parent_id, la categoría actual es la subcategoría
        subcategoria = cat.nombre;
        const padre = categorias.find(p => p.id === cat.parent_id);
        categoriaPrincipal = padre ? padre.nombre : '-';
      } else {
        // Si no tiene padre, es una categoría principal directamente
        categoriaPrincipal = cat.nombre;
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow mt-6">
      <Link to="/productos" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Volver a Productos</Link>
      
      <h1 className="text-3xl font-bold mb-4">{producto.nombre}</h1>
      
      <p className="mb-2"><span className="font-semibold">Precio:</span> ${producto.precio}</p>
      <p className="mb-2"><span className="font-semibold">Descripción:</span> {producto.descripcion || '-'}</p>
      
      {/* ACÁ AGREGAMOS LOS DOS CAMPOS SEPARADOS */}
      <p className="mb-2"><span className="font-semibold">Categoría:</span> {categoriaPrincipal}</p>
      <p className="mb-4"><span className="font-semibold">Subcategoría:</span> {subcategoria}</p>
      
      <h2 className="text-xl font-bold mb-2">Ingredientes:</h2>
      {producto.ingredientes && producto.ingredientes.length > 0 ? (
        <ul className="list-disc pl-5">
          {producto.ingredientes.map((ing: any) => (
            <li key={ing.id}>{ing.nombre} ({ing.unidad})</li>
          ))}
        </ul>
      ) : (
        <p>No tiene ingredientes asignados.</p>
      )}
    </div>
  )
}