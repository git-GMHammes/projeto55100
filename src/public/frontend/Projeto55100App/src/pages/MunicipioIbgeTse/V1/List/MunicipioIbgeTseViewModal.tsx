import React from 'react'
import type { MunicipioIbgeTseTable } from '../../../../services/modules/V1/municipioIbgeTseService'

function fmt(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="col-12 col-md-4 mb-2">
      <span className="text-muted small d-block">{label}</span>
      <span className="fw-semibold">{value}</span>
    </div>
  )
}

interface ModalTheme {
  headerStart: string
  headerEnd: string
  headerText: string
}

interface MunicipioIbgeTseViewModalProps {
  viewData: MunicipioIbgeTseTable | null
  loadingView: boolean
  viewModalRef: React.RefObject<HTMLDivElement>
  theme: ModalTheme
}

function MunicipioIbgeTseViewModal({
  viewData,
  loadingView,
  viewModalRef,
  theme,
}: MunicipioIbgeTseViewModalProps) {
  return (
    <div
      ref={viewModalRef}
      className="modal fade"
      id="municipioIbgeTseViewModal"
      tabIndex={-1}
      aria-labelledby="municipioIbgeTseViewModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable">
        <div className="modal-content">

          <div
            className="modal-header"
            style={{
              background: `linear-gradient(135deg, ${theme.headerStart} 0%, ${theme.headerEnd} 100%)`,
            }}
          >
            <h5
              className="modal-title fw-semibold"
              id="municipioIbgeTseViewModalLabel"
              style={{ color: theme.headerText, letterSpacing: '0.03em' }}
            >
              Visualizar Município{viewData ? ` — ${viewData.nm_cidade ?? viewData.cd_ibge}` : ''}
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
                <Row label="Cód. IBGE" value={fmt(viewData.cd_ibge)} />
                <Row label="Cód. TSE" value={fmt(viewData.cd_tse)} />
                <Row label="Nome da Cidade" value={fmt(viewData.nm_cidade)} />
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

export default MunicipioIbgeTseViewModal
