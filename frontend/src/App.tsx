import { Link } from 'react-router-dom'
import AppRouter from './AppRouter'

export default function App() {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-blue-700 text-white px-6 py-4 flex gap-6">
                <span className="font-bold text-lg">ParcialApp</span>
                <Link to="/categorias" className="hover:underline">Categorías</Link>
                <Link to="/ingredientes" className="hover:underline">Ingredientes</Link>
                <Link to="/productos" className="hover:underline">Productos</Link>
            </nav>
            <main className="p-6">
                <AppRouter />
            </main>
        </div>
    )
}