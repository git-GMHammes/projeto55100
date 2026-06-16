import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { authPublicRoutes } from './Auth'
import { usuariosPublicRoutes } from './Usuarios'
import { homePrivateRoutes } from './Home'
import { eleicaoPrivateRoutes } from './Eleicao'

const publicRoutes = [
  ...authPublicRoutes,
  ...usuariosPublicRoutes,
]

const privateRoutes = [
  ...homePrivateRoutes,
  ...eleicaoPrivateRoutes,
]

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/v1/login" replace />} />
        <Route path="/v1" element={<Navigate to="/v1/login" replace />} />
        <Route path="/v1/" element={<Navigate to="/v1/login" replace />} />
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        {privateRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
