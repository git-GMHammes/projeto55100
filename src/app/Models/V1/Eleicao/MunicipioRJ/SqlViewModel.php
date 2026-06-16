<?php

namespace App\Models\V1\Eleicao\MunicipioRJ;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_municipio_RJ.
 *
 * Campos disponíveis na view (prefixo mn_ = municipio_RJ, md_ = mandatario_RJ):
 *   id, mn_cd_ibge, mn_cd_tse, mn_nome_cidade, mn_aniversario_cidade,
 *   mn_prefeito_mandatario_RJ_id, mn_vice_prefeito, mn_vice_dt_nascimento,
 *   mn_primeira_dama, mn_primeira_dama_dt_nascimento, mn_festa_popular,
 *   mn_dt_festa_popular, mn_populacao, mn_eleitores, mn_densidade_demografica,
 *   mn_crescimento_populacional, mn_populacao_urbana, mn_populacao_rural,
 *   mn_pib_municipal, mn_pib_per_capita, mn_receita_orcamentaria,
 *   mn_despesa_orcamentaria, mn_arrecadacao_propria, mn_empresas_ativas,
 *   mn_empregos_formais, mn_idhm, mn_indice_gini, mn_percentual_pobres,
 *   mn_bolsa_familia_benef, mn_ideb_anos_iniciais, mn_ideb_anos_finais,
 *   mn_taxa_analfabetismo, mn_matriculas_creche, mn_distorcao_idade_serie,
 *   mn_mortalidade_infantil, mn_cobertura_saude_familia, mn_leitos_por_habitante,
 *   mn_esperanca_vida, mn_acesso_agua_tratada, mn_acesso_esgoto,
 *   mn_coleta_lixo_adequada, mn_acesso_internet, mn_deficit_habitacional,
 *   mn_superlotacao, mn_favelas_subnormais, mn_taxa_homicidios,
 *   mn_num_roubos_furtos, mn_area_vegetacao, mn_risco_enchente,
 *   mn_data_emancipacao, mn_area_territorial,
 *   created_at, updated_at, deleted_at,
 *   md_id, md_candidato_2022_RJ_id, md_candidato_2024_RJ_id, md_cargo_politico,
 *   md_suplente_candidato_RJ_id, md_ocupa_instituicao, md_cargo_instituicao,
 *   md_partido_politico, md_nome_politico, md_dt_nascimento, md_municipio_mandato,
 *   md_whatsapp, md_youtube, md_facebook, md_instagram, md_email
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup    = DB_GROUP_001;
    protected $table      = 'view_municipio_RJ';
    protected $primaryKey = 'id';

    /** Campos de texto que usam LIKE %valor% no findPaginatedView. */
    protected array $likeFields = [
        'mn_cd_ibge',
        'mn_cd_tse',
        'mn_nome_cidade',
        'mn_vice_prefeito',
        'mn_primeira_dama',
        'mn_festa_popular',
        'md_cargo_politico',
        'md_ocupa_instituicao',
        'md_cargo_instituicao',
        'md_partido_politico',
        'md_nome_politico',
        'md_municipio_mandato',
        'md_email',
    ];

    /** Colunas permitidas em ORDER BY. */
    protected array $sortableFields = [
        'id',
        'mn_cd_ibge',
        'mn_cd_tse',
        'mn_nome_cidade',
        'mn_populacao',
        'mn_eleitores',
        'mn_pib_municipal',
        'mn_idhm',
        'mn_area_territorial',
        'md_nome_politico',
        'md_partido_politico',
        'created_at',
        'updated_at',
    ];

    /** Colunas usadas na busca textual (GET /search). */
    public array $searchFields = [
        'mn_cd_ibge',
        'mn_cd_tse',
        'mn_nome_cidade',
        'mn_vice_prefeito',
        'mn_primeira_dama',
        'md_nome_politico',
        'md_cargo_politico',
        'md_partido_politico',
        'md_municipio_mandato',
        'md_email',
    ];
}
