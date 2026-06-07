import { useNavigate } from 'react-router-dom'
import { clearSession, getUser } from '../../services/modules/V1/authService/session'
import { getActiveTheme } from '../../themes/global'

function PrivateHome() {
  const navigate = useNavigate()
  const user = getUser()
  const { login: theme } = getActiveTheme()

  const handleLogout = () => {
    clearSession()
    navigate('/v1/login', { replace: true })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.bgStart} 0%, ${theme.bgMid} 55%, ${theme.bgEnd} 100%)`,
        padding: '1.5rem',
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          width: '100%',
          maxWidth: 520,
          borderRadius: '1rem',
          backgroundColor: theme.cardBg,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${theme.headerStart} 0%, ${theme.headerEnd} 100%)`,
            padding: '2rem 2rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <h1 className="mb-0 fw-semibold" style={{ color: theme.headerText, letterSpacing: '0.03em' }}>
            Home Privada
          </h1>
        </div>
        <div className="card-body px-4 pt-4 pb-3">
          <p className="mb-4" style={{ color: theme.headerText }}>
            Bem-vindo à página inicial privada do sistema.
          </p>
          <div className="mb-3">
            <strong>Usuário:</strong> {user?.um_user ?? 'admin'}
          </div>
          <div className="mb-3">
            <strong>Perfil:</strong> {user?.uc_profile ?? 'admin'}
          </div>
          <button
            type="button"
            className="btn w-100 mt-2 fw-semibold"
            onClick={handleLogout}
            style={{
              backgroundColor: theme.btnBg,
              borderColor: theme.btnBg,
              color: theme.btnText,
              borderRadius: '0.5rem',
              padding: '0.6rem',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.btnBgHover)}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.btnBg)}
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrivateHome
