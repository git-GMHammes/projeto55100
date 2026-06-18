import React from 'react'
import FormGrid, { type FormGridSchema } from '../../../../../components/ui/FormGrid/Input'
import type { MandatarioRJTable } from '../../../../../services/modules/V1/mandatarioRJService'
import type { UseMandatarioRJEditReturn } from './useMandatarioRJEdit'

// ─── Schema do formulário ─────────────────────────────────────────────────────

function buildEditSchema(data: MandatarioRJTable | null): FormGridSchema {
  const s = (v: string | number | null | undefined) =>
    v !== null && v !== undefined ? String(v) : ''

  return {
    rows: [
      {
        sectionTitle: 'Identificação',
        fields: [
          { col: 8, label: 'Nome Político', id: 'nome_politico', name: 'nome_politico', value: s(data?.nome_politico), required: true },
          { col: 4, label: 'Data de Nascimento', id: 'dt_nascimento', name: 'dt_nascimento', type: 'data' as const, value: s(data?.dt_nascimento) },
        ],
      },
      {
        fields: [
          { col: 4, label: 'Cargo Político', id: 'cargo_politico', name: 'cargo_politico', value: s(data?.cargo_politico) },
          { col: 4, label: 'Partido Político', id: 'partido_politico', name: 'partido_politico', value: s(data?.partido_politico) },
          { col: 4, label: 'Município do Mandato', id: 'municipio_mandato', name: 'municipio_mandato', value: s(data?.municipio_mandato) },
        ],
      },
      {
        sectionTitle: 'Instituição',
        fields: [
          { col: 6, label: 'Ocupa Instituição', id: 'ocupa_instituicao', name: 'ocupa_instituicao', value: s(data?.ocupa_instituicao) },
          { col: 6, label: 'Cargo na Instituição', id: 'cargo_instituicao', name: 'cargo_instituicao', value: s(data?.cargo_instituicao) },
        ],
      },
      {
        sectionTitle: 'Referências eleitorais',
        fields: [
          { col: 4, label: 'Cand. 2022 RJ (id)', id: 'candidato_2022_RJ_id', name: 'candidato_2022_RJ_id', value: s(data?.candidato_2022_RJ_id), inputMode: 'numeric' as const },
          { col: 4, label: 'Cand. 2024 RJ (id)', id: 'candidato_2024_RJ_id', name: 'candidato_2024_RJ_id', value: s(data?.candidato_2024_RJ_id), inputMode: 'numeric' as const },
          { col: 4, label: 'Suplente (id)', id: 'suplente_candidato_RJ_id', name: 'suplente_candidato_RJ_id', value: s(data?.suplente_candidato_RJ_id), inputMode: 'numeric' as const },
        ],
      },
      {
        fields: [
          { col: 4, label: 'Quantidade de Votos', id: 'qtd_votos', name: 'qtd_votos', value: s(data?.qtd_votos), inputMode: 'numeric' as const },
        ],
      },
      {
        sectionTitle: 'Contato / Redes Sociais',
        fields: [
          { col: 4, label: 'WhatsApp', id: 'whatsapp', name: 'whatsapp', value: s(data?.whatsapp) },
          { col: 8, label: 'E-mail', id: 'email', name: 'email', value: s(data?.email) },
        ],
      },
      {
        fields: [
          { col: 4, label: 'YouTube', id: 'youtube', name: 'youtube', value: s(data?.youtube) },
          { col: 4, label: 'Facebook', id: 'facebook', name: 'facebook', value: s(data?.facebook) },
          { col: 4, label: 'Instagram', id: 'instagram', name: 'instagram', value: s(data?.instagram) },
        ],
      },
    ],
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ModalTheme {
  headerStart: string
  headerEnd: string
  headerText: string
}

type MandatarioRJEditModalProps = Omit<UseMandatarioRJEditReturn, 'handleNew' | 'handleEdit'> & {
  theme: ModalTheme
}

// ─── Componente ───────────────────────────────────────────────────────────────

function MandatarioRJEditModal({
  mode,
  editId,
  editData,
  loadingEdit,
  saving,
  saveError,
  saveSuccess,
  modalRef,
  handleSave,
  theme,
}: MandatarioRJEditModalProps) {
  const editSchema = buildEditSchema(editData)
  const isCreate = mode === 'create'

  return (
    <div
      ref={modalRef}
      className="modal fade"
      id="mandatarioEditModal"
      tabIndex={-1}
      aria-labelledby="mandatarioEditModalLabel"
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
              id="mandatarioEditModalLabel"
              style={{ color: theme.headerText, letterSpacing: '0.03em' }}
            >
              {isCreate
                ? 'Novo Candidato'
                : `Editar Candidato${editData ? ` — ${editData.nome_politico ?? ''}` : ''}`}
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
              <form id="mandatarioEditForm" onSubmit={handleSave} noValidate autoComplete="off">
                {saveError && (
                  <div className="alert alert-danger py-2 mb-3">{saveError}</div>
                )}
                {saveSuccess && (
                  <div className="alert alert-success py-2 mb-3">
                    {isCreate ? 'Candidato criado com sucesso.' : 'Salvo com sucesso.'}
                  </div>
                )}
                <FormGrid key={isCreate ? 'new' : (editId ?? 0)} schema={editSchema} />
              </form>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button
              type="submit"
              form="mandatarioEditForm"
              className="btn btn-primary fw-semibold"
              disabled={saving || loadingEdit}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Salvando…
                </>
              ) : isCreate ? 'Criar' : 'Salvar'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default MandatarioRJEditModal
