import { Navigate } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard'
import { isAuthenticated } from '../../services/modules/V1/authService/session'

const dashboardPrivateRoutes = [
  {
    path: '/v1/dashboard',
    element: isAuthenticated() ? <Dashboard /> : <Navigate to="/v1/login" replace />,
  },
]

export default dashboardPrivateRoutes
