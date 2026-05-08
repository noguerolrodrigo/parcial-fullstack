import { Routes, Route } from 'react-router-dom'
import CategoriasPage from './pages/CategoriasPage'
import IngredientesPage from './pages/IngredientesPage'
import ProductosPage from './pages/ProductosPage'
import ProductoDetalle from './pages/ProductoDetalle'

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="/ingredientes" element={<IngredientesPage />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/productos/:id" element={<ProductoDetalle />} />
            <Route path="/" element={<CategoriasPage />} />
        </Routes>
    )
}