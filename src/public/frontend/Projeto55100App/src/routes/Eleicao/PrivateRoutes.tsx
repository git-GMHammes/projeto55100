import { Navigate } from 'react-router-dom'
import MunicipioRJList from '../../pages/Eleicao/MunicipioRJ/V1/List'
import { isAuthenticated } from '../../services/modules/V1/authService/session'

function PrivateMunicipioRJ() {
  return isAuthenticated() ? <MunicipioRJList /> : <Navigate to="/v1/login" replace />
}

const eleicaoPrivateRoutes = [
  {
    path: '/v1/municipio-rj',
    element: <PrivateMunicipioRJ />,
  },
]

export default eleicaoPrivateRoutes
