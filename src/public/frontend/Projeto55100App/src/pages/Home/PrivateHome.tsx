import { useNavigate } from 'react-router-dom'
import { clearSession, getUser } from '../../services/modules/V1/authService/session'
import { getActiveTheme } from '../../themes/global'
import { MapaRJ } from '../../components/ui'

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
        background: `linear-gradient(135deg, ${theme.bgStart} 0%, ${theme.bgMid} 55%, ${theme.bgEnd} 100%)`,
        padding: '1.5rem',
      }}
    >
      {/* Barra superior */}
      <div className="d-flex justify-content-between align-items-center mb-3 px-1">
        <span style={{ color: theme.headerText, fontSize: '0.9rem' }}>
          <strong>Usuário:</strong> {user?.um_user ?? 'admin'}
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <strong>Perfil:</strong> {user?.uc_profile ?? 'admin'}
        </span>
        <button
          type="button"
          className="btn btn-sm fw-semibold"
          onClick={handleLogout}
          style={{
            backgroundColor: theme.btnBg,
            borderColor: theme.btnBg,
            color: theme.btnText,
            borderRadius: '0.5rem',
            padding: '0.35rem 1.2rem',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.btnBgHover)}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.btnBg)}
        >
          Sair
        </button>
      </div>

      {/* Botão flutuante — Lista de Municípios */}
      <button
        type="button"
        title="Lista de Municípios"
        className="btn btn-sm shadow"
        onClick={() => navigate('/v1/municipio-rj')}
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          zIndex: 1040,
          backgroundColor: theme.headerStart,
          borderColor: theme.headerStart,
          color: theme.headerText,
          opacity: 0.65,
          borderRadius: '0.75rem',
          padding: '0.45rem 0.75rem',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.65')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
          <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
        </svg>
      </button>

      {/* Card Mapa RJ */}
      <div
        className="card shadow-lg border-0"
        style={{ borderRadius: '1rem', overflow: 'hidden' }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${theme.headerStart} 0%, ${theme.headerEnd} 100%)`,
            padding: '1rem 1.5rem',
          }}
        >
          <h1 className="mb-0 fw-semibold h5" style={{ color: theme.headerText, letterSpacing: '0.03em' }}>
            Mapa RJ
          </h1>
        </div>
        <div className="card-body p-0">
          <MapaRJ height={740} />
        </div>
      </div>
    </div>
  )
}

export default PrivateHome
