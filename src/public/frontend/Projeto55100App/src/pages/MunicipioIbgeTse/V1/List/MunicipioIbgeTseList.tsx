import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import FormGrid, { type FormGridSchema } from '../../../../components/ui/FormGrid/Input'
import { getActiveTheme } from '../../../../themes/global'
import { clearSession, getUser } from '../../../../services/modules/V1/authService/session'
import { PrivateTopbar } from '../../../../components/layout/PrivateTopbar'
import {
  getAll,
  search,
  getById,
  deleteHardTable,
  type MunicipioIbgeTseTable,
} from '../../../../services/modules/V1/municipioIbgeTseService'
import { useMunicipioIbgeTseEdit } from './useMunicipioIbgeTseEdit'
import MunicipioIbgeTseEditModal from './MunicipioIbgeTseEditModal'
import MunicipioIbgeTseViewModal from './MunicipioIbgeTseViewModal'
import MunicipioIbgeTseDataTable from './MunicipioIbgeTseDataTable'

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
            id: 'municipio-ibge-tse-search',
            name: 'municipio-ibge-tse-search',
            placeholder: 'Buscar por código IBGE, código TSE ou nome da cidade…',
            value: query,
            onChange,
          },
        ],
      },
    ],
  }
}

function MunicipioIbgeTseList() {
  const navigate = useNavigate()
  const { login: theme } = getActiveTheme()
  const user = getUser()

  const [items, setItems] = useState<MunicipioIbgeTseTable[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [viewData, setViewData] = useState<MunicipioIbgeTseTable | null>(null)
  const [loadingView, setLoadingView] = useState(false)
  const viewModalRef = useRef<HTMLDivElement>(null)

  const edit = useMunicipioIbgeTseEdit(() => void load(query))

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
        ? await search(q.trim())
        : await getAll()
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

  async function handleView(cdIbge: string) {
    setViewData(null)
    setLoadingView(true)

    const bootstrap = (window as unknown as Record<string, unknown>)['bootstrap'] as {
      Modal: { getOrCreateInstance: (el: Element) => { show(): void } }
    }
    if (viewModalRef.current && bootstrap?.Modal) {
      bootstrap.Modal.getOrCreateInstance(viewModalRef.current).show()
    }

    try {
      const res = await getById(cdIbge)
      if (res.success && res.data) {
        setViewData(res.data)
      }
    } catch {
      // silencia — modal mostra vazio
    } finally {
      setLoadingView(false)
    }
  }

  async function handleDelete(cdIbge: string, nome: string) {
    if (!window.confirm(`Excluir "${nome}" (${cdIbge})? Esta ação é permanente e não pode ser desfeita.`)) return
    try {
      const res = await deleteHardTable(cdIbge)
      if (res.success) {
        void load(query)
      } else {
        setError(res.message ?? 'Erro ao excluir município')
      }
    } catch {
      setError('Erro de conexão ao excluir')
    }
  }

  function handleLogout() {
    clearSession()
    navigate('/v1/login', { replace: true })
  }

  const searchSchema = buildSearchSchema(query, e => setQuery(e.target.value))

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.bgStart} 0%, ${theme.bgMid} 55%, ${theme.bgEnd} 100%)`,
        padding: '1.5rem',
      }}
    >
      <PrivateTopbar
        username={user?.um_user ?? '—'}
        onLogout={handleLogout}
        theme={theme}
      />

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
            Municípios IBGE / TSE
          </h1>
        </div>

        <div className="card-body p-3">

          {/* ── Busca + Botão Novo ── */}
          <div className="d-flex align-items-start gap-2 mb-3">
            <div style={{ flex: 1 }}>
              <FormGrid schema={searchSchema} />
            </div>
            <button
              type="button"
              className="btn btn-primary fw-semibold"
              title="Novo Município"
              style={{ whiteSpace: 'nowrap', marginTop: '0.05rem' }}
              data-bs-toggle="modal"
              data-bs-target="#municipioIbgeTseEditModal"
              onClick={edit.handleNew}
            >
              + Novo Município
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
            <MunicipioIbgeTseDataTable
              items={items}
              query={query}
              onEdit={cdIbge => void edit.handleEdit(cdIbge)}
              onView={cdIbge => void handleView(cdIbge)}
              onDelete={(cdIbge, nome) => void handleDelete(cdIbge, nome)}
            />
          )}
        </div>
      </div>

      {/* ── Modal Editar / Criar ── */}
      <MunicipioIbgeTseEditModal {...edit} theme={theme} />

      {/* ── Modal Visualizar ── */}
      <MunicipioIbgeTseViewModal
        viewData={viewData}
        loadingView={loadingView}
        viewModalRef={viewModalRef}
        theme={theme}
      />
    </div>
  )
}

export default MunicipioIbgeTseList
