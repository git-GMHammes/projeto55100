import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FormGrid, { type FormGridSchema } from '../../../../../components/ui/FormGrid/Input'
import { getActiveTheme } from '../../../../../themes/global'
import { clearSession, getUser } from '../../../../../services/modules/V1/authService/session'
import {
  getAllView,
  searchView,
  type MunicipioRJView,
} from '../../../../../services/modules/V1/municipioRJService'
import { useMunicipioRJEdit } from './useMunicipioRJEdit'
import MunicipioRJEditModal from './MunicipioRJEditModal'
import MunicipioRJDataTable from './MunicipioRJDataTable'

// ─── Schema de busca ──────────────────────────────────────────────────────────

function buildSearchSchema(
  query: string,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
): FormGridSchema {
  return {
    rows: [
      {
        fields: [
          {
            col: 12,
            id: 'municipio-search',
            name: 'municipio-search',
            placeholder: 'Buscar por cidade, prefeito, vice, primeira dama ou festa popular…',
            value: query,
            onChange,
          },
        ],
      },
    ],
  }
}

// ─── Componente principal ─────────────────────────────────────────────────────

function MunicipioRJList() {
  const navigate = useNavigate()
  const { login: theme } = getActiveTheme()
  const user = getUser()

  const [items, setItems] = useState<MunicipioRJView[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const edit = useMunicipioRJEdit(() => void load(query))

  // ── Debounce de busca ──────────────────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => {
      void load(query)
    }, query ? 400 : 0)
    return () => clearTimeout(timer)
  }, [query])

  async function load(q: string) {
    setLoading(true)
    setError(null)
    try {
      const res = q.trim()
        ? await searchView(q.trim())
        : await getAllView()
      if (res.success && Array.isArray(res.data)) {
        setItems(res.data)
      } else {
        setError(res.message ?? 'Erro ao carregar municípios')
      }
    } catch {
      setError('Erro de conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }

  // ── Logout ─────────────────────────────────────────────────────────────────

  function handleLogout() {
    clearSession()
    navigate('/v1/login', { replace: true })
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const searchSchema = buildSearchSchema(query, e => setQuery(e.target.value))

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.bgStart} 0%, ${theme.bgMid} 55%, ${theme.bgEnd} 100%)`,
        padding: '1.5rem',
      }}
    >
      {/* ── Barra superior ── */}
      <div className="d-flex justify-content-between align-items-center mb-3 px-1">
        <span style={{ color: theme.headerText, fontSize: '0.9rem' }}>
          <strong>Usuário:</strong> {user?.um_user ?? '—'}
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
          }}
        >
          Sair
        </button>
      </div>

      {/* ── Card principal ── */}
      <div className="card shadow-lg border-0" style={{ borderRadius: '1rem', overflow: 'hidden' }}>

        {/* Cabeçalho */}
        <div
          style={{
            background: `linear-gradient(135deg, ${theme.headerStart} 0%, ${theme.headerEnd} 100%)`,
            padding: '1rem 1.5rem',
          }}
        >
          <h1 className="mb-0 fw-semibold h5" style={{ color: theme.headerText, letterSpacing: '0.03em' }}>
            Municípios do Rio de Janeiro
          </h1>
        </div>

        <div className="card-body p-3">

          {/* ── Busca + Botão Mapa ── */}
          <div className="d-flex align-items-start gap-2 mb-3">
            <div style={{ flex: 1 }}>
              <FormGrid schema={searchSchema} />
            </div>
            <button
              type="button"
              className="btn btn-outline-primary"
              title="Mapa"
              style={{ whiteSpace: 'nowrap', marginTop: '0.05rem' }}
              onClick={() => navigate('/v1/home')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
              </svg>
            </button>
          </div>

          {/* ── Feedback ── */}
          {error && (
            <div className="alert alert-danger py-2 mb-3" role="alert">{error}</div>
          )}

          {loading && (
            <div className="d-flex justify-content-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando…</span>
              </div>
            </div>
          )}

          {/* ── Tabela ── */}
          {!loading && (
            <MunicipioRJDataTable
              items={items}
              query={query}
              onEdit={id => void edit.handleEdit(id)}
            />
          )}
        </div>
      </div>

      {/* ── Modal de Edição ── */}
      <MunicipioRJEditModal {...edit} theme={theme} />
    </div>
  )
}

export default MunicipioRJList
