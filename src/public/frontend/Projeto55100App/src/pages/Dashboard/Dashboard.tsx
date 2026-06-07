import { useNavigate } from 'react-router-dom'
import { clearSession, getUser } from '../../services/modules/V1/authService/session'

function Dashboard() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    clearSession()
    navigate('/v1/login', { replace: true })
  }

  return (
    <div className="container py-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="card-title mb-3">Área Privada</h1>
          <p className="card-text">
            Esta é a porta de entrada do sistema. O acesso privado é liberado apenas após a autenticação simples.
          </p>
          <div className="mb-3">
            <strong>Usuário:</strong> {user?.um_user ?? 'admin'}
          </div>
          <div className="mb-3">
            <strong>Perfil:</strong> {user?.uc_profile ?? 'admin'}
          </div>
          <button type="button" className="btn btn-primary" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
