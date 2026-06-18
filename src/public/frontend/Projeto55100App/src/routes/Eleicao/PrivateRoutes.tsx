import { Navigate } from 'react-router-dom'
import MunicipioRJList from '../../pages/Eleicao/MunicipioRJ/V1/List'
import MandatarioRJList from '../../pages/Eleicao/MandatarioRJ/V1/List'
import MunicipioIbgeTseList from '../../pages/MunicipioIbgeTse/V1/List'
import { isAuthenticated } from '../../services/modules/V1/authService/session'

function PrivateMunicipioRJ() {
  return isAuthenticated() ? <MunicipioRJList /> : <Navigate to="/v1/login" replace />
}

function PrivateMandatarioRJ() {
  return isAuthenticated() ? <MandatarioRJList /> : <Navigate to="/v1/login" replace />
}

function PrivateMunicipioIbgeTse() {
  return isAuthenticated() ? <MunicipioIbgeTseList /> : <Navigate to="/v1/login" replace />
}

const eleicaoPrivateRoutes = [
  {
    path: '/v1/municipio-rj',
    element: <PrivateMunicipioRJ />,
  },
  {
    path: '/v1/mandatario-rj',
    element: <PrivateMandatarioRJ />,
  },
  {
    path: '/v1/municipio-ibge-tse',
    element: <PrivateMunicipioIbgeTse />,
  },
]

export default eleicaoPrivateRoutes
