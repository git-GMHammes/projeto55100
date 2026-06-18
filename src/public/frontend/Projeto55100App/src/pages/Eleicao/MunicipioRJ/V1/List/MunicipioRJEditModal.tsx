import React from 'react'
import FormGrid, { type FormGridSchema } from '../../../../../components/ui/FormGrid/Input'
import type { MunicipioRJTable } from '../../../../../services/modules/V1/municipioRJService'
import type { UseMunicipioRJEditReturn } from './useMunicipioRJEdit'

// ─── Schema do formulário de edição ──────────────────────────────────────────

function buildEditSchema(data: MunicipioRJTable | null): FormGridSchema {
  const s = (v: string | number | null | undefined) =>
    v !== null && v !== undefined ? String(v) : ''

  return {
    rows: [
      // Titulo: Identificação
      {
        sectionTitle: 'Identificação',
        fields: [
          { col: 2, label: 'Cód. IBGE', id: 'cd_ibge', name: 'cd_ibge', value: s(data?.cd_ibge) },
          { col: 2, label: 'Cód. TSE', id: 'cd_tse', name: 'cd_tse', value: s(data?.cd_tse) },
          { col: 8, label: 'Nome da Cidade', id: 'nome_cidade', name: 'nome_cidade', value: s(data?.nome_cidade), required: true },
        ],
      },
      {
        fields: [
          { col: 4, label: 'Aniversário', id: 'aniversario_cidade', name: 'aniversario_cidade', type: 'data' as const, value: s(data?.aniversario_cidade) },
          { col: 4, label: 'Data Emancipação', id: 'data_emancipacao', name: 'data_emancipacao', type: 'data' as const, value: s(data?.data_emancipacao) },
          { col: 4, label: 'Área Territorial (km²)', id: 'area_territorial', name: 'area_territorial', value: s(data?.area_territorial), inputMode: 'decimal' as const },
        ],
      },
      // Titulo: Prefeito / mandato
      {
        sectionTitle: 'Prefeito / Mandato',
        fields: [
          { col: 12, label: 'Prefeito', id: 'prefeito_mandatario_RJ_id', name: 'prefeito_mandatario_RJ_id', value: s(data?.prefeito_mandatario_RJ_id), inputMode: 'numeric' as const },
        ],
      },
      {
        fields: [
          { col: 9, label: 'Vice-Prefeito', id: 'vice_prefeito', name: 'vice_prefeito', value: s(data?.vice_prefeito), noNumbers: true },
          { col: 3, label: 'Aniversário', id: 'vice_dt_nascimento', name: 'vice_dt_nascimento', type: 'data' as const, value: s(data?.vice_dt_nascimento) },
        ],
      },
      {
        fields: [
          { col: 9, label: 'Primeira Dama', id: 'primeira_dama', name: 'primeira_dama', value: s(data?.primeira_dama), noNumbers: true },
          { col: 3, label: 'Nasc. Primeira Dama', id: 'primeira_dama_dt_nascimento', name: 'primeira_dama_dt_nascimento', type: 'data' as const, value: s(data?.primeira_dama_dt_nascimento) },
        ],
      },
      {
        fields: [
          { col: 9, label: 'Festa Popular', id: 'festa_popular', name: 'festa_popular', value: s(data?.festa_popular) },
          { col: 3, label: 'Data Festa Popular', id: 'dt_festa_popular', name: 'dt_festa_popular', type: 'data' as const, value: s(data?.dt_festa_popular) },
        ],
      },
      // Titulo: Dados populacionais
      {
        sectionTitle: 'Dados Populacionais',
        fields: [
          { col: 4, label: 'População', id: 'populacao', name: 'populacao', value: s(data?.populacao), inputMode: 'numeric' as const },
          { col: 4, label: 'Eleitores', id: 'eleitores', name: 'eleitores', value: s(data?.eleitores), inputMode: 'numeric' as const },
          { col: 4, label: 'Pop. Urbana', id: 'populacao_urbana', name: 'populacao_urbana', value: s(data?.populacao_urbana), inputMode: 'numeric' as const },
        ],
      },
      {
        fields: [
          { col: 4, label: 'Pop. Rural', id: 'populacao_rural', name: 'populacao_rural', value: s(data?.populacao_rural), inputMode: 'numeric' as const },
          { col: 4, label: 'Densidade Demográfica (hab/km²)', id: 'densidade_demografica', name: 'densidade_demografica', value: s(data?.densidade_demografica), inputMode: 'decimal' as const },
          { col: 4, label: 'Crescimento Populacional (% a.a.)', id: 'crescimento_populacional', name: 'crescimento_populacional', value: s(data?.crescimento_populacional), inputMode: 'decimal' as const },
        ],
      },
      // Titulo: Econômico
      {
        sectionTitle: 'Econômico',
        fields: [
          { col: 3, label: 'PIB Municipal (R$ mi)', id: 'pib_municipal', name: 'pib_municipal', value: s(data?.pib_municipal), inputMode: 'decimal' as const },
          { col: 3, label: 'PIB per Capita (R$)', id: 'pib_per_capita', name: 'pib_per_capita', value: s(data?.pib_per_capita), inputMode: 'decimal' as const },
          { col: 3, label: 'Receita Orçamentária (R$)', id: 'receita_orcamentaria', name: 'receita_orcamentaria', value: s(data?.receita_orcamentaria), inputMode: 'decimal' as const },
          { col: 3, label: 'Despesa Orçamentária (R$)', id: 'despesa_orcamentaria', name: 'despesa_orcamentaria', value: s(data?.despesa_orcamentaria), inputMode: 'decimal' as const },
        ],
      },
      {
        fields: [
          { col: 4, label: 'Arrecadação Própria (R$)', id: 'arrecadacao_propria', name: 'arrecadacao_propria', value: s(data?.arrecadacao_propria), inputMode: 'decimal' as const },
          { col: 4, label: 'Empresas Ativas', id: 'empresas_ativas', name: 'empresas_ativas', value: s(data?.empresas_ativas), inputMode: 'numeric' as const },
          { col: 4, label: 'Empregos Formais', id: 'empregos_formais', name: 'empregos_formais', value: s(data?.empregos_formais), inputMode: 'numeric' as const },
        ],
      },
      // Titulo: Social
      {
        sectionTitle: 'Social',
        fields: [
          { col: 3, label: 'IDHM (0-1)', id: 'idhm', name: 'idhm', value: s(data?.idhm), inputMode: 'decimal' as const },
          { col: 3, label: 'Índice Gini (0-1)', id: 'indice_gini', name: 'indice_gini', value: s(data?.indice_gini), inputMode: 'decimal' as const },
          { col: 3, label: '% Pobres', id: 'percentual_pobres', name: 'percentual_pobres', value: s(data?.percentual_pobres), inputMode: 'decimal' as const },
          { col: 3, label: 'Benef. Bolsa Família', id: 'bolsa_familia_benef', name: 'bolsa_familia_benef', value: s(data?.bolsa_familia_benef), inputMode: 'numeric' as const },
        ],
      },
      // Titulo: Educação
      {
        sectionTitle: 'Educação',
        fields: [
          { col: 3, label: 'IDEB Anos Iniciais', id: 'ideb_anos_iniciais', name: 'ideb_anos_iniciais', value: s(data?.ideb_anos_iniciais), inputMode: 'decimal' as const },
          { col: 2, label: 'IDEB Anos Finais', id: 'ideb_anos_finais', name: 'ideb_anos_finais', value: s(data?.ideb_anos_finais), inputMode: 'decimal' as const },
          { col: 2, label: 'Taxa Analfabetismo (%)', id: 'taxa_analfabetismo', name: 'taxa_analfabetismo', value: s(data?.taxa_analfabetismo), inputMode: 'decimal' as const },
          { col: 2, label: 'Matrículas Creche', id: 'matriculas_creche', name: 'matriculas_creche', value: s(data?.matriculas_creche), inputMode: 'numeric' as const },
          { col: 3, label: 'Distorção Idade-Série (%)', id: 'distorcao_idade_serie', name: 'distorcao_idade_serie', value: s(data?.distorcao_idade_serie), inputMode: 'decimal' as const },
        ],
      },
      // Titulo: Saúde
      {
        sectionTitle: 'Saúde',
        fields: [
          { col: 3, label: 'Mortalidade Infantil (por mil)', id: 'mortalidade_infantil', name: 'mortalidade_infantil', value: s(data?.mortalidade_infantil), inputMode: 'decimal' as const },
          { col: 3, label: 'Cobertura Saúde Família (%)', id: 'cobertura_saude_familia', name: 'cobertura_saude_familia', value: s(data?.cobertura_saude_familia), inputMode: 'decimal' as const },
          { col: 3, label: 'Leitos/mil hab', id: 'leitos_por_habitante', name: 'leitos_por_habitante', value: s(data?.leitos_por_habitante), inputMode: 'decimal' as const },
          { col: 3, label: 'Esperança de Vida (anos)', id: 'esperanca_vida', name: 'esperanca_vida', value: s(data?.esperanca_vida), inputMode: 'decimal' as const },
        ],
      },
      // Titulo: Infraestrutura
      {
        sectionTitle: 'Infraestrutura',
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
      // Titulo: Segurança / Meio Ambiente
      {
        sectionTitle: 'Segurança / Meio Ambiente',
        fields: [
          { col: 4, label: 'Taxa Homicídios (por 100mil)', id: 'taxa_homicidios', name: 'taxa_homicidios', value: s(data?.taxa_homicidios), inputMode: 'decimal' as const },
          { col: 4, label: 'Roubos/Furtos (ano)', id: 'num_roubos_furtos', name: 'num_roubos_furtos', value: s(data?.num_roubos_furtos), inputMode: 'numeric' as const },
          { col: 4, label: 'Área Vegetação (ha)', id: 'area_vegetacao', name: 'area_vegetacao', value: s(data?.area_vegetacao), inputMode: 'decimal' as const },
        ],
      },
    ],
  }
}

// ─── Tipos de props ───────────────────────────────────────────────────────────

interface ModalTheme {
  headerStart: string
  headerEnd: string
  headerText: string
}

type MunicipioRJEditModalProps = Omit<UseMunicipioRJEditReturn, 'handleEdit'> & {
  theme: ModalTheme
}

// ─── Componente ───────────────────────────────────────────────────────────────

function MunicipioRJEditModal({
  editId,
  editData,
  loadingEdit,
  saving,
  saveError,
  saveSuccess,
  modalRef,
  handleSave,
  theme,
}: MunicipioRJEditModalProps) {
  const editSchema = buildEditSchema(editData)

  return (
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
            <h5
              className="modal-title fw-semibold"
              id="municipioEditModalLabel"
              style={{ color: theme.headerText, letterSpacing: '0.03em' }}
            >
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
  )
}

export default MunicipioRJEditModal
