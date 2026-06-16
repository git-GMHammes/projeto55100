import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import FormGrid, { type FormGridSchema } from '../../../../../components/ui/FormGrid/Input'
import { getActiveTheme } from '../../../../../themes/global'
import { clearSession, getUser } from '../../../../../services/modules/V1/authService/session'
import {
  getAllView,
  searchView,
  getByIdTable,
  updateTable,
  type MunicipioRJView,
  type MunicipioRJTable,
} from '../../../../../services/modules/V1/municipioRJService'


// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

function fmtNum(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return Number(value).toLocaleString('pt-BR')
}

function fmtDate(value: string | null | undefined): string {
  if (!value) return '—'
  const [y, m, d] = value.split('-')
  if (!y || !m || !d) return value
  return `${d}/${m}/${y}`
}

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

// ─── Schema do formulário de edição ──────────────────────────────────────────

function buildEditSchema(data: MunicipioRJTable | null): FormGridSchema {
  const s = (v: string | number | null | undefined) =>
    v !== null && v !== undefined ? String(v) : ''

  return {
    rows: [
      // Identificação
      {
        fields: [
          { col: 4, label: 'Cód. IBGE', id: 'cd_ibge', name: 'cd_ibge', value: s(data?.cd_ibge) },
          { col: 4, label: 'Cód. TSE', id: 'cd_tse', name: 'cd_tse', value: s(data?.cd_tse) },
          { col: 4, label: 'Nome da Cidade', id: 'nome_cidade', name: 'nome_cidade', value: s(data?.nome_cidade), required: true },
        ],
      },
      {
        fields: [
          { col: 4, label: 'Aniversário', id: 'aniversario_cidade', name: 'aniversario_cidade', type: 'data' as const, value: s(data?.aniversario_cidade) },
          { col: 4, label: 'Data Emancipação', id: 'data_emancipacao', name: 'data_emancipacao', type: 'data' as const, value: s(data?.data_emancipacao) },
          { col: 4, label: 'Área Territorial (km²)', id: 'area_territorial', name: 'area_territorial', value: s(data?.area_territorial), inputMode: 'decimal' as const },
        ],
      },
      // Prefeito / mandato
      {
        fields: [
          { col: 4, label: 'Prefeito — ID Mandatário', id: 'prefeito_mandatario_RJ_id', name: 'prefeito_mandatario_RJ_id', value: s(data?.prefeito_mandatario_RJ_id), inputMode: 'numeric' as const },
          { col: 4, label: 'Vice-Prefeito', id: 'vice_prefeito', name: 'vice_prefeito', value: s(data?.vice_prefeito), noNumbers: true },
          { col: 4, label: 'Nasc. Vice', id: 'vice_dt_nascimento', name: 'vice_dt_nascimento', type: 'data' as const, value: s(data?.vice_dt_nascimento) },
        ],
      },
      {
        fields: [
          { col: 4, label: 'Primeira Dama', id: 'primeira_dama', name: 'primeira_dama', value: s(data?.primeira_dama), noNumbers: true },
          { col: 4, label: 'Nasc. Primeira Dama', id: 'primeira_dama_dt_nascimento', name: 'primeira_dama_dt_nascimento', type: 'data' as const, value: s(data?.primeira_dama_dt_nascimento) },
          { col: 4, label: 'Festa Popular', id: 'festa_popular', name: 'festa_popular', value: s(data?.festa_popular) },
        ],
      },
      {
        fields: [
          { col: 4, label: 'Data Festa Popular', id: 'dt_festa_popular', name: 'dt_festa_popular', type: 'data' as const, value: s(data?.dt_festa_popular) },
        ],
      },
      // Dados populacionais
      {
        fields: [
          { col: 3, label: 'População', id: 'populacao', name: 'populacao', value: s(data?.populacao), inputMode: 'numeric' as const },
          { col: 3, label: 'Eleitores', id: 'eleitores', name: 'eleitores', value: s(data?.eleitores), inputMode: 'numeric' as const },
          { col: 3, label: 'Pop. Urbana', id: 'populacao_urbana', name: 'populacao_urbana', value: s(data?.populacao_urbana), inputMode: 'numeric' as const },
          { col: 3, label: 'Pop. Rural', id: 'populacao_rural', name: 'populacao_rural', value: s(data?.populacao_rural), inputMode: 'numeric' as const },
        ],
      },
      {
        fields: [
          { col: 6, label: 'Densidade Demográfica (hab/km²)', id: 'densidade_demografica', name: 'densidade_demografica', value: s(data?.densidade_demografica), inputMode: 'decimal' as const },
          { col: 6, label: 'Crescimento Populacional (% a.a.)', id: 'crescimento_populacional', name: 'crescimento_populacional', value: s(data?.crescimento_populacional), inputMode: 'decimal' as const },
        ],
      },
      // Econômico
      {
        fields: [
          { col: 4, label: 'PIB Municipal (R$ mi)', id: 'pib_municipal', name: 'pib_municipal', value: s(data?.pib_municipal), inputMode: 'decimal' as const },
          { col: 4, label: 'PIB per Capita (R$)', id: 'pib_per_capita', name: 'pib_per_capita', value: s(data?.pib_per_capita), inputMode: 'decimal' as const },
          { col: 4, label: 'Receita Orçamentária (R$)', id: 'receita_orcamentaria', name: 'receita_orcamentaria', value: s(data?.receita_orcamentaria), inputMode: 'decimal' as const },
        ],
      },
      {
        fields: [
          { col: 4, label: 'Despesa Orçamentária (R$)', id: 'despesa_orcamentaria', name: 'despesa_orcamentaria', value: s(data?.despesa_orcamentaria), inputMode: 'decimal' as const },
          { col: 4, label: 'Arrecadação Própria (R$)', id: 'arrecadacao_propria', name: 'arrecadacao_propria', value: s(data?.arrecadacao_propria), inputMode: 'decimal' as const },
          { col: 4, label: 'Empresas Ativas', id: 'empresas_ativas', name: 'empresas_ativas', value: s(data?.empresas_ativas), inputMode: 'numeric' as const },
        ],
      },
      {
        fields: [
          { col: 6, label: 'Empregos Formais', id: 'empregos_formais', name: 'empregos_formais', value: s(data?.empregos_formais), inputMode: 'numeric' as const },
        ],
      },
      // Social
      {
        fields: [
          { col: 3, label: 'IDHM (0-1)', id: 'idhm', name: 'idhm', value: s(data?.idhm), inputMode: 'decimal' as const },
          { col: 3, label: 'Índice Gini (0-1)', id: 'indice_gini', name: 'indice_gini', value: s(data?.indice_gini), inputMode: 'decimal' as const },
          { col: 3, label: '% Pobres', id: 'percentual_pobres', name: 'percentual_pobres', value: s(data?.percentual_pobres), inputMode: 'decimal' as const },
          { col: 3, label: 'Benef. Bolsa Família', id: 'bolsa_familia_benef', name: 'bolsa_familia_benef', value: s(data?.bolsa_familia_benef), inputMode: 'numeric' as const },
        ],
      },
      // Educação
      {
        fields: [
          { col: 3, label: 'IDEB Anos Iniciais', id: 'ideb_anos_iniciais', name: 'ideb_anos_iniciais', value: s(data?.ideb_anos_iniciais), inputMode: 'decimal' as const },
          { col: 3, label: 'IDEB Anos Finais', id: 'ideb_anos_finais', name: 'ideb_anos_finais', value: s(data?.ideb_anos_finais), inputMode: 'decimal' as const },
          { col: 3, label: 'Taxa Analfabetismo (%)', id: 'taxa_analfabetismo', name: 'taxa_analfabetismo', value: s(data?.taxa_analfabetismo), inputMode: 'decimal' as const },
          { col: 3, label: 'Matrículas Creche', id: 'matriculas_creche', name: 'matriculas_creche', value: s(data?.matriculas_creche), inputMode: 'numeric' as const },
        ],
      },
      {
        fields: [
          { col: 6, label: 'Distorção Idade-Série (%)', id: 'distorcao_idade_serie', name: 'distorcao_idade_serie', value: s(data?.distorcao_idade_serie), inputMode: 'decimal' as const },
        ],
      },
      // Saúde
      {
        fields: [
          { col: 3, label: 'Mortalidade Infantil (por mil)', id: 'mortalidade_infantil', name: 'mortalidade_infantil', value: s(data?.mortalidade_infantil), inputMode: 'decimal' as const },
          { col: 3, label: 'Cobertura Saúde Família (%)', id: 'cobertura_saude_familia', name: 'cobertura_saude_familia', value: s(data?.cobertura_saude_familia), inputMode: 'decimal' as const },
          { col: 3, label: 'Leitos/mil hab', id: 'leitos_por_habitante', name: 'leitos_por_habitante', value: s(data?.leitos_por_habitante), inputMode: 'decimal' as const },
          { col: 3, label: 'Esperança de Vida (anos)', id: 'esperanca_vida', name: 'esperanca_vida', value: s(data?.esperanca_vida), inputMode: 'decimal' as const },
        ],
      },
      // Infraestrutura
      {
        fields: [
          { col: 3, label: 'Água Tratada (%)', id: 'acesso_agua_tratada', name: 'acesso_agua_tratada', value: s(data?.acesso_agua_tratada), inputMode: 'decimal' as const },
          { col: 3, label: 'Esgoto (%)', id: 'acesso_esgoto', name: 'acesso_esgoto', value: s(data?.acesso_esgoto), inputMode: 'decimal' as const },
          { col: 3, label: 'Coleta de Lixo (%)', id: 'coleta_lixo_adequada', name: 'coleta_lixo_adequada', value: s(data?.coleta_lixo_adequada), inputMode: 'decimal' as const },
          { col: 3, label: 'Internet (%)', id: 'acesso_internet', name: 'acesso_internet', value: s(data?.acesso_internet), inputMode: 'decimal' as const },
        ],
      },
      {
        fields: [
          { col: 4, label: 'Déficit Habitacional', id: 'deficit_habitacional', name: 'deficit_habitacional', value: s(data?.deficit_habitacional), inputMode: 'numeric' as const },
          { col: 4, label: 'Superlotação (%)', id: 'superlotacao', name: 'superlotacao', value: s(data?.superlotacao), inputMode: 'decimal' as const },
          { col: 4, label: 'Favelas/Subnormais', id: 'favelas_subnormais', name: 'favelas_subnormais', value: s(data?.favelas_subnormais), inputMode: 'numeric' as const },
        ],
      },
      // Segurança / Meio Ambiente
      {
        fields: [
          { col: 4, label: 'Taxa Homicídios (por 100mil)', id: 'taxa_homicidios', name: 'taxa_homicidios', value: s(data?.taxa_homicidios), inputMode: 'decimal' as const },
          { col: 4, label: 'Roubos/Furtos (ano)', id: 'num_roubos_furtos', name: 'num_roubos_furtos', value: s(data?.num_roubos_furtos), inputMode: 'numeric' as const },
          { col: 4, label: 'Área Vegetação (ha)', id: 'area_vegetacao', name: 'area_vegetacao', value: s(data?.area_vegetacao), inputMode: 'decimal' as const },
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

  const [editId, setEditId] = useState<number | null>(null)
  const [editData, setEditData] = useState<MunicipioRJTable | null>(null)
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)

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

  // ── Abrir edição ──────────────────────────────────────────────────────────

  async function handleEdit(id: number) {
    setEditId(id)
    setEditData(null)
    setSaveError(null)
    setSaveSuccess(false)
    setLoadingEdit(true)

    const modal = (window as unknown as Record<string, unknown>)['bootstrap'] as {
      Modal: { getOrCreateInstance: (el: Element) => { show(): void } }
    }
    if (modalRef.current && modal?.Modal) {
      modal.Modal.getOrCreateInstance(modalRef.current).show()
    }

    try {
      const res = await getByIdTable(id)
      if (res.success && res.data) {
        setEditData(res.data)
      } else {
        setSaveError(res.message ?? 'Erro ao carregar registro')
      }
    } catch {
      setSaveError('Erro de conexão ao carregar registro')
    } finally {
      setLoadingEdit(false)
    }
  }

  // ── Salvar edição ─────────────────────────────────────────────────────────

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editId) return
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    const fd = new FormData(e.currentTarget)
    const payload: Record<string, unknown> = {}
    fd.forEach((v, k) => { payload[k] = v === '' ? null : v })

    try {
      const res = await updateTable(editId, payload)
      if (res.success) {
        setSaveSuccess(true)
        void load(query)
      } else {
        setSaveError(res.message ?? 'Erro ao salvar')
      }
    } catch {
      setSaveError('Erro de conexão ao salvar')
    } finally {
      setSaving(false)
    }
  }

  // ── Logout ─────────────────────────────────────────────────────────────────

  function handleLogout() {
    clearSession()
    navigate('/v1/login', { replace: true })
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const searchSchema = buildSearchSchema(query, e => setQuery(e.target.value))
  const editSchema = buildEditSchema(editData)

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
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
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
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 70 }}>Ações</th>
                    <th>Cidade</th>
                    <th>Aniversário</th>
                    <th>Prefeito</th>
                    <th>Vice-Prefeito</th>
                    <th>Nasc. Vice</th>
                    <th>Primeira Dama</th>
                    <th>Nasc. P. Dama</th>
                    <th>Festa Popular</th>
                    <th>Data Festa</th>
                    <th className="text-end">População</th>
                    <th className="text-end">Eleitores</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="text-center text-muted py-3">
                        {query ? 'Nenhum resultado encontrado.' : 'Nenhum município cadastrado.'}
                      </td>
                    </tr>
                  ) : (
                    items.map(item => (
                      <tr key={item.id}>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            title="Editar"
                            data-bs-toggle="modal"
                            data-bs-target="#municipioEditModal"
                            onClick={() => void handleEdit(item.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                            </svg>
                          </button>
                        </td>
                        <td>{fmt(item.mn_nome_cidade)}</td>
                        <td>{fmtDate(item.mn_aniversario_cidade)}</td>
                        <td>{fmt(item.md_nome_politico)}</td>
                        <td>{fmt(item.mn_vice_prefeito)}</td>
                        <td>{fmtDate(item.mn_vice_dt_nascimento)}</td>
                        <td>{fmt(item.mn_primeira_dama)}</td>
                        <td>{fmtDate(item.mn_primeira_dama_dt_nascimento)}</td>
                        <td>{fmt(item.mn_festa_popular)}</td>
                        <td>{fmtDate(item.mn_dt_festa_popular)}</td>
                        <td className="text-end">{fmtNum(item.mn_populacao)}</td>
                        <td className="text-end">{fmtNum(item.mn_eleitores)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal de Edição ── */}
      <div
        ref={modalRef}
        className="modal fade"
        id="municipioEditModal"
        tabIndex={-1}
        aria-labelledby="municipioEditModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content">

            <div
              className="modal-header"
              style={{
                background: `linear-gradient(135deg, ${theme.headerStart} 0%, ${theme.headerEnd} 100%)`,
              }}
            >
              <h5 className="modal-title fw-semibold" id="municipioEditModalLabel" style={{ color: theme.headerText, letterSpacing: '0.03em' }}>
                Editar Município {editData ? `— ${editData.nome_cidade ?? ''}` : ''}
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar" />
            </div>

            <div className="modal-body">
              {loadingEdit && (
                <div className="d-flex justify-content-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando…</span>
                  </div>
                </div>
              )}

              {!loadingEdit && (
                <form id="municipioEditForm" onSubmit={handleSave} noValidate autoComplete="off">

                  {saveError && (
                    <div className="alert alert-danger py-2 mb-3">{saveError}</div>
                  )}
                  {saveSuccess && (
                    <div className="alert alert-success py-2 mb-3">Salvo com sucesso.</div>
                  )}

                  <FormGrid key={editId ?? 0} schema={editSchema} />
                </form>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button
                type="submit"
                form="municipioEditForm"
                className="btn btn-primary fw-semibold"
                disabled={saving || loadingEdit}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Salvando…
                  </>
                ) : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MunicipioRJList
