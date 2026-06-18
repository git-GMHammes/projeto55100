import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Offcanvas } from '../../ui'
import type { PrivateTopbarProps } from './PrivateTopbar.types'

const NAV_ITEMS = [
  { path: '/v1/home', label: 'Início / Mapa RJ' },
  { path: '/v1/municipio-rj', label: 'Municípios do Rio de Janeiro' },
  { path: '/v1/mandatario-rj', label: 'Mandatários do Rio de Janeiro' },
  { path: '/v1/municipio-ibge-tse', label: 'Municípios IBGE / TSE' },
]

function PrivateTopbar({ username, onLogout, theme }: PrivateTopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  function handleNav(path: string) {
    setMenuOpen(false)
    navigate(path)
  }

  const menuBody = (
    <ul className="list-group list-group-flush">
      {NAV_ITEMS.map(item => (
        <li key={item.path} className="list-group-item list-group-item-action p-0">
          <button
            type="button"
            className={`btn w-100 text-start px-3 py-2 ${location.pathname === item.path ? 'fw-semibold' : ''}`}
            style={{
              background: location.pathname === item.path ? 'rgba(0,0,0,0.06)' : 'transparent',
              border: 'none',
              borderRadius: 0,
            }}
            onClick={() => handleNav(item.path)}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 px-1">
        {/* Hambúrguer */}
        <button
          type="button"
          className="btn btn-sm"
          aria-label="Abrir menu"
          onClick={() => setMenuOpen(true)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: theme.headerText,
            padding: '0.35rem 0.5rem',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
            />
          </svg>
        </button>

        {/* Usuário + Sair */}
        <div className="d-flex align-items-center gap-2">
          <span style={{ color: theme.headerText, fontSize: '0.9rem' }}>
            <strong>Usuário:</strong> {username}
          </span>
          <button
            type="button"
            className="btn btn-sm fw-semibold"
            onClick={onLogout}
            style={{
              backgroundColor: theme.btnBg,
              borderColor: theme.btnBg,
              color: theme.btnText,
              borderRadius: '0.5rem',
              padding: '0.35rem 1.2rem',
            }}
            onMouseEnter={e => {
              if (theme.btnBgHover)
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.btnBgHover
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.btnBg
            }}
          >
            Sair
          </button>
        </div>
      </div>

      <Offcanvas
        id="private-nav-offcanvas"
        title="Menu"
        body={menuBody}
        placement="start"
        show={menuOpen}
        onHide={() => setMenuOpen(false)}
      />
    </>
  )
}

export default PrivateTopbar
