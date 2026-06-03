import { HashRouter, Routes, Route } from 'react-router-dom'
import { authPublicRoutes } from './Auth'
import { usuariosPublicRoutes } from './Usuarios'
import Home from '../pages/Home'

const publicRoutes = [
  ...authPublicRoutes,
  ...usuariosPublicRoutes,
]

function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </HashRouter>
  )
}

export default AppRoutes
