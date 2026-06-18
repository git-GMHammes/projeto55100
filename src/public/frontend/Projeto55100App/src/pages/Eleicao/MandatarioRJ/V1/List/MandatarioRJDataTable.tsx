import React from 'react'
import type { MandatarioRJView } from '../../../../../services/modules/V1/mandatarioRJService'

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

// ─── Props ────────────────────────────────────────────────────────────────────

interface MandatarioRJDataTableProps {
  items: MandatarioRJView[]
  query: string
  onEdit: (id: number) => void
  onView: (id: number) => void
  onDelete: (id: number, nome: string) => void
}

// ─── Componente ───────────────────────────────────────────────────────────────

function MandatarioRJDataTable({ items, query, onEdit, onView, onDelete }: MandatarioRJDataTableProps) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th style={{ width: 60 }}>Editar</th>
            <th>Nome Político</th>
            <th>Cargo</th>
            <th>Partido</th>
            <th>Município</th>
            <th>Dt Nasc.</th>
            <th className="text-end">Votos</th>
            <th>WhatsApp</th>
            <th>E-mail</th>
            <th style={{ width: 70 }}>Ver</th>
            <th style={{ width: 70 }}>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={11} className="text-center text-muted py-3">
                {query ? 'Nenhum resultado encontrado.' : 'Nenhum candidato cadastrado.'}
              </td>
            </tr>
          ) : (
            items.map(item => (
              <tr key={item.id}>
                {/* Col 1 — Editar */}
                <td>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    title="Editar"
                    data-bs-toggle="modal"
                    data-bs-target="#mandatarioEditModal"
                    onClick={() => onEdit(item.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                    </svg>
                  </button>
                </td>

                {/* Colunas de dados */}
                <td>{fmt(item.nome_politico)}</td>
                <td>{fmt(item.cargo_politico)}</td>
                <td>{fmt(item.partido_politico)}</td>
                <td>{fmt(item.municipio_mandato)}</td>
                <td>{fmtDate(item.dt_nascimento)}</td>
                <td className="text-end">{fmtNum(item.qtd_votos)}</td>
                <td>{fmt(item.whatsapp)}</td>
                <td>{fmt(item.email)}</td>

                {/* Col N-1 — Visualizar */}
                <td>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-info"
                    title="Visualizar"
                    data-bs-toggle="modal"
                    data-bs-target="#mandatarioViewModal"
                    onClick={() => onView(item.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                    </svg>
                  </button>
                </td>

                {/* Col N — Excluir */}
                <td>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    title="Excluir"
                    onClick={() => onDelete(item.id, item.nome_politico ?? String(item.id))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default MandatarioRJDataTable
