import React from 'react'
import type { MunicipioRJView } from '../../../../../services/modules/V1/municipioRJService'

// ─── Helpers de formatação ────────────────────────────────────────────────────

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

interface MunicipioRJDataTableProps {
  items: MunicipioRJView[]
  query: string
  onEdit: (id: number) => void
}

// ─── Componente ───────────────────────────────────────────────────────────────

function MunicipioRJDataTable({ items, query, onEdit }: MunicipioRJDataTableProps) {
  return (
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
                    onClick={() => onEdit(item.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
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
  )
}

export default MunicipioRJDataTable
