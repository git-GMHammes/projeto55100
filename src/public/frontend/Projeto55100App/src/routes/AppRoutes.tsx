import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { authPublicRoutes } from './Auth'
import { usuariosPublicRoutes } from './Usuarios'
import Home from '../pages/Home'

const publicRoutes = [
  ...authPublicRoutes,
  ...usuariosPublicRoutes,
]

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/v1" element={<Navigate to="/v1/login" replace />} />
        <Route path="/v1/" element={<Navigate to="/v1/login" replace />} />
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
