import { Routes, Route, Link } from 'react-router-dom'
import CategoriasPage from './pages/CategoriasPage'
import IngredientesPage from './pages/IngredientesPage'
import ProductosPage from './pages/ProductosPage'
import ProductoDetalle from './pages/ProductoDetalle'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-700 text-white px-6 py-4 flex gap-6">
        <span className="font-bold text-lg">ParcialApp</span>
        <Link to="/categorias" className="hover:underline">Categorías</Link>
        <Link to="/ingredientes" className="hover:underline">Ingredientes</Link>
        <Link to="/productos" className="hover:underline">Productos</Link>
      </nav>
      <main className="p-6">
        <Routes>
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/ingredientes" element={<IngredientesPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/productos/:id" element={<ProductoDetalle />} />
          <Route path="/" element={<CategoriasPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App