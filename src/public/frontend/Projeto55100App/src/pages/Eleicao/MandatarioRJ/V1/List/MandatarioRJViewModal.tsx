import React from 'react'
import type { MandatarioRJTable } from '../../../../../services/modules/V1/mandatarioRJService'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

function fmtDate(value: string | null | undefined): string {
  if (!value) return '—'
  const [y, m, d] = value.split('-')
  if (!y || !m || !d) return value
  return `${d}/${m}/${y}`
}

function fmtNum(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return Number(value).toLocaleString('pt-BR')
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="col-12 col-md-6 mb-2">
      <span className="text-muted small d-block">{label}</span>
      <span className="fw-semibold">{value}</span>
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ModalTheme {
  headerStart: string
  headerEnd: string
  headerText: string
}

interface MandatarioRJViewModalProps {
  viewData: MandatarioRJTable | null
  loadingView: boolean
  viewModalRef: React.RefObject<HTMLDivElement>
  theme: ModalTheme
}

// ─── Componente ───────────────────────────────────────────────────────────────

function MandatarioRJViewModal({
  viewData,
  loadingView,
  viewModalRef,
  theme,
}: MandatarioRJViewModalProps) {
  return (
    <div
      ref={viewModalRef}
      className="modal fade"
      id="mandatarioViewModal"
      tabIndex={-1}
      aria-labelledby="mandatarioViewModalLabel"
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
            <h5
              className="modal-title fw-semibold"
              id="mandatarioViewModalLabel"
              style={{ color: theme.headerText, letterSpacing: '0.03em' }}
            >
              Visualizar Candidato{viewData ? ` — ${viewData.nome_politico ?? ''}` : ''}
            </h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar" />
          </div>

          <div className="modal-body">
            {loadingView && (
              <div className="d-flex justify-content-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando…</span>
                </div>
              </div>
            )}

            {!loadingView && viewData && (
              <div className="row">
                <div className="col-12 mb-3">
                  <h6 className="text-muted text-uppercase small fw-bold border-bottom pb-1">Identificação</h6>
                </div>
                <Row label="Nome Político" value={fmt(viewData.nome_politico)} />
                <Row label="Data de Nascimento" value={fmtDate(viewData.dt_nascimento)} />
                <Row label="Cargo Político" value={fmt(viewData.cargo_politico)} />
                <Row label="Partido Político" value={fmt(viewData.partido_politico)} />
                <Row label="Município do Mandato" value={fmt(viewData.municipio_mandato)} />
                <Row label="Quantidade de Votos" value={fmtNum(viewData.qtd_votos)} />

                <div className="col-12 mb-3 mt-3">
                  <h6 className="text-muted text-uppercase small fw-bold border-bottom pb-1">Instituição</h6>
                </div>
                <Row label="Ocupa Instituição" value={fmt(viewData.ocupa_instituicao)} />
                <Row label="Cargo na Instituição" value={fmt(viewData.cargo_instituicao)} />

                <div className="col-12 mb-3 mt-3">
                  <h6 className="text-muted text-uppercase small fw-bold border-bottom pb-1">Referências Eleitorais</h6>
                </div>
                <Row label="Candidato 2022 RJ (id)" value={fmt(viewData.candidato_2022_RJ_id)} />
                <Row label="Candidato 2024 RJ (id)" value={fmt(viewData.candidato_2024_RJ_id)} />
                <Row label="Suplente (id)" value={fmt(viewData.suplente_candidato_RJ_id)} />

                <div className="col-12 mb-3 mt-3">
                  <h6 className="text-muted text-uppercase small fw-bold border-bottom pb-1">Contato / Redes Sociais</h6>
                </div>
                <Row label="WhatsApp" value={fmt(viewData.whatsapp)} />
                <Row label="E-mail" value={fmt(viewData.email)} />
                <Row label="YouTube" value={fmt(viewData.youtube)} />
                <Row label="Facebook" value={fmt(viewData.facebook)} />
                <Row label="Instagram" value={fmt(viewData.instagram)} />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Fechar
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default MandatarioRJViewModal
