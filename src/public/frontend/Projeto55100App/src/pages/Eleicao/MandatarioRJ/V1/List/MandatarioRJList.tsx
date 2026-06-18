import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import FormGrid, { type FormGridSchema } from '../../../../../components/ui/FormGrid/Input'
import { getActiveTheme } from '../../../../../themes/global'
import { clearSession, getUser } from '../../../../../services/modules/V1/authService/session'
import {
  getAllView,
  searchView,
  getByIdTable,
  deleteSoftTable,
  type MandatarioRJView,
  type MandatarioRJTable,
} from '../../../../../services/modules/V1/mandatarioRJService'
import { useMandatarioRJEdit } from './useMandatarioRJEdit'
import MandatarioRJEditModal from './MandatarioRJEditModal'
import MandatarioRJViewModal from './MandatarioRJViewModal'
import MandatarioRJDataTable from './MandatarioRJDataTable'

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
            id: 'mandatario-search',
            name: 'mandatario-search',
            placeholder: 'Buscar por nome, cargo, partido, município, instituição ou e-mail…',
            value: query,
            onChange,
          },
        ],
      },
    ],
  }
}

// ─── Componente principal ─────────────────────────────────────────────────────

function MandatarioRJList() {
  const navigate = useNavigate()
  const { login: theme } = getActiveTheme()
  const user = getUser()

  const [items, setItems] = useState<MandatarioRJView[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── View modal (visualizar) ────────────────────────────────────────────────
  const [viewData, setViewData] = useState<MandatarioRJTable | null>(null)
  const [loadingView, setLoadingView] = useState(false)
  const viewModalRef = useRef<HTMLDivElement>(null)

  const edit = useMandatarioRJEdit(() => void load(query))

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
        setError(res.message ?? 'Erro ao carregar candidatos')
      }
    } catch {
      setError('Erro de conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }

  // ── Visualizar ─────────────────────────────────────────────────────────────

  async function handleView(id: number) {
    setViewData(null)
    setLoadingView(true)

    const bootstrap = (window as unknown as Record<string, unknown>)['bootstrap'] as {
      Modal: { getOrCreateInstance: (el: Element) => { show(): void } }
    }
    if (viewModalRef.current && bootstrap?.Modal) {
      bootstrap.Modal.getOrCreateInstance(viewModalRef.current).show()
    }

    try {
      const res = await getByIdTable(id)
      if (res.success && res.data) {
        setViewData(res.data)
      }
    } catch {
      // silencia — modal mostra vazio
    } finally {
      setLoadingView(false)
    }
  }

  // ── Excluir ────────────────────────────────────────────────────────────────

  async function handleDelete(id: number, nome: string) {
    if (!window.confirm(`Excluir "${nome}"? A ação pode ser desfeita via restauração.`)) return
    try {
      const res = await deleteSoftTable(id)
      if (res.success) {
        void load(query)
      } else {
        setError(res.message ?? 'Erro ao excluir candidato')
      }
    } catch {
      setError('Erro de conexão ao excluir')
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
            Mandatários do Rio de Janeiro
          </h1>
        </div>

        <div className="card-body p-3">

          {/* ── Busca + Botão Novo Candidato ── */}
          <div className="d-flex align-items-start gap-2 mb-3">
            <div style={{ flex: 1 }}>
              <FormGrid schema={searchSchema} />
            </div>
            <button
              type="button"
              className="btn btn-primary fw-semibold"
              title="Novo Candidato"
              style={{ whiteSpace: 'nowrap', marginTop: '0.05rem' }}
              data-bs-toggle="modal"
              data-bs-target="#mandatarioEditModal"
              onClick={edit.handleNew}
            >
              + Novo Candidato
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
            <MandatarioRJDataTable
              items={items}
              query={query}
              onEdit={id => void edit.handleEdit(id)}
              onView={id => void handleView(id)}
              onDelete={(id, nome) => void handleDelete(id, nome)}
            />
          )}
        </div>
      </div>

      {/* ── Modal Editar / Criar ── */}
      <MandatarioRJEditModal {...edit} theme={theme} />

      {/* ── Modal Visualizar ── */}
      <MandatarioRJViewModal
        viewData={viewData}
        loadingView={loadingView}
        viewModalRef={viewModalRef}
        theme={theme}
      />
    </div>
  )
}

export default MandatarioRJList
