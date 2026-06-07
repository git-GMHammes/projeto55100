import { Navigate } from 'react-router-dom'
import Home from '../../pages/Home/PrivateHome'
import { isAuthenticated } from '../../services/modules/V1/authService/session'

const homePrivateRoutes = [
  {
    path: '/v1/home',
    element: isAuthenticated() ? <Home /> : <Navigate to="/v1/login" replace />,
  },
]

export default homePrivateRoutes
