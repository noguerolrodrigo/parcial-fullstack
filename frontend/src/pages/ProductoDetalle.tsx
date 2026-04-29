import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProducto, getCategorias } from '../api/api'

export default function ProductoDetalle() {
    const { id } = useParams()
    const productoId = parseInt(id as string)

    const { data: producto, isLoading, isError } = useQuery({
        queryKey: ['producto', productoId],
        queryFn: () => getProducto(productoId),
    })

    const { data: categorias } = useQuery({ 
        queryKey: ['categorias'], 
        queryFn: getCategorias 
    })

    if (isLoading) return <p className="text-center mt-10">Cargando...</p>
    if (isError) return <p className="text-center mt-10 text-red-500">Producto no encontrado</p>

    const categoria = categorias?.find((c: any) => c.id === producto?.categoria_id)
    
    // Le decimos a TypeScript que no moleste con la interfaz usando (producto as any)
    const ingredientesDelProducto = (producto as any)?.ingredientes || []

    return (
        <div className="max-w-lg mx-auto bg-white rounded shadow p-6">
            <Link to="/productos" className="text-blue-600 hover:underline mb-4 block">
                ← Volver a Productos
            </Link>
            <h1 className="text-3xl font-bold mb-4">{producto?.nombre}</h1>
            <p className="text-gray-600 mb-2"><span className="font-semibold">Precio:</span> ${producto?.precio}</p>
            <p className="text-gray-600 mb-2"><span className="font-semibold">Descripción:</span> {producto?.descripcion || '-'}</p>
            <p className="text-gray-600 mb-4">
                <span className="font-semibold">Categoría:</span> {categoria?.nombre || 'Sin categoría'}
            </p>
            
            <div>
                <p className="font-semibold mb-2">Ingredientes:</p>
                {ingredientesDelProducto.length > 0 ? (
                    <ul className="list-disc list-inside">
                        {ingredientesDelProducto.map((i: any) => (
                            <li key={i.id}>{i.nombre} ({i.unidad})</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Sin ingredientes</p>
                )}
            </div>
        </div>
    )
}