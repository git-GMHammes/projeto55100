import React from 'react'
import FormGrid, { type FormGridSchema } from '../../../../components/ui/FormGrid/Input'
import type { MunicipioIbgeTseTable } from '../../../../services/modules/V1/municipioIbgeTseService'
import type { UseMunicipioIbgeTseEditReturn } from './useMunicipioIbgeTseEdit'

function buildEditSchema(data: MunicipioIbgeTseTable | null, isCreate: boolean): FormGridSchema {
  const s = (v: string | null | undefined) => v ?? ''

  return {
    rows: [
      {
        sectionTitle: 'Identificação',
        fields: [
          {
            col: 4,
            label: 'Cód. IBGE',
            id: 'cd_ibge',
            name: 'cd_ibge',
            value: s(data?.cd_ibge),
            required: isCreate,
            readOnly: !isCreate,
            inputMode: 'numeric' as const,
          },
          {
            col: 4,
            label: 'Cód. TSE',
            id: 'cd_tse',
            name: 'cd_tse',
            value: s(data?.cd_tse),
            inputMode: 'numeric' as const,
          },
          {
            col: 4,
            label: 'Nome da Cidade',
            id: 'nm_cidade',
            name: 'nm_cidade',
            value: s(data?.nm_cidade),
          },
        ],
      },
    ],
  }
}

interface ModalTheme {
  headerStart: string
  headerEnd: string
  headerText: string
}

type MunicipioIbgeTseEditModalProps = Omit<UseMunicipioIbgeTseEditReturn, 'handleNew' | 'handleEdit'> & {
  theme: ModalTheme
}

function MunicipioIbgeTseEditModal({
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
}: MunicipioIbgeTseEditModalProps) {
  const isCreate = mode === 'create'
  const editSchema = buildEditSchema(editData, isCreate)

  return (
    <div
      ref={modalRef}
      className="modal fade"
      id="municipioIbgeTseEditModal"
      tabIndex={-1}
      aria-labelledby="municipioIbgeTseEditModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">

          <div
            className="modal-header"
            style={{
              background: `linear-gradient(135deg, ${theme.headerStart} 0%, ${theme.headerEnd} 100%)`,
            }}
          >
            <h5
              className="modal-title fw-semibold"
              id="municipioIbgeTseEditModalLabel"
              style={{ color: theme.headerText, letterSpacing: '0.03em' }}
            >
              {isCreate
                ? 'Novo Município IBGE/TSE'
                : `Editar Município${editData ? ` — ${editData.nm_cidade ?? editId ?? ''}` : ''}`}
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
              <form id="municipioIbgeTseEditForm" onSubmit={handleSave} noValidate autoComplete="off">
                {saveError && (
                  <div className="alert alert-danger py-2 mb-3">{saveError}</div>
                )}
                {saveSuccess && (
                  <div className="alert alert-success py-2 mb-3">
                    {isCreate ? 'Município criado com sucesso.' : 'Salvo com sucesso.'}
                  </div>
                )}
                <FormGrid key={isCreate ? 'new' : (editId ?? '')} schema={editSchema} />
              </form>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button
              type="submit"
              form="municipioIbgeTseEditForm"
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

export default MunicipioIbgeTseEditModal
