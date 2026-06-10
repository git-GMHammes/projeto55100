<?php

namespace App\Models\V1\Eleicao\VotacaoCandidatoMunzona2022RJ;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_votacao_candidato_munzona_2022_RJ_group.
 *
 * Campos disponíveis na view:
 *   ID, DS_CARGO, NR_CANDIDATO, NM_CANDIDATO, NM_SOCIAL_CANDIDATO,
 *   QT_VOTOS_NOMINAIS, DS_SIT_TOT_TURNO
 *
 * Todos os métodos de leitura estão disponíveis via BaseViewModel.
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup   = DB_GROUP_001;
    protected $table     = 'view_votacao_candidato_munzona_2022_RJ_group';
    protected $primaryKey = 'ID';

    /** Campos de texto que usam LIKE %valor% no findPaginatedView. */
    protected array $likeFields = [
        'NM_MUNICIPIO',
        'DS_CARGO',
        'NR_CANDIDATO',
        'NM_CANDIDATO',
        'NM_SOCIAL_CANDIDATO',
        'DS_SIT_TOT_TURNO',
    ];

    /** Campos válidos para ordenação */
    protected array $sortableFields = [
        'ID',
        'CD_MUNICIPIO',
        'NM_MUNICIPIO',
        'DS_CARGO',
        'NR_CANDIDATO',
        'NM_CANDIDATO',
        'NM_SOCIAL_CANDIDATO',
        'QT_VOTOS_NOMINAIS',
        'DS_SIT_TOT_TURNO',
    ];

    /** Campos utilizados na busca textual (GET /search) */
    public array $searchFields = [
        'NM_MUNICIPIO',
        'DS_CARGO',
        'NR_CANDIDATO',
        'NM_CANDIDATO',
        'NM_SOCIAL_CANDIDATO',
        'DS_SIT_TOT_TURNO',
    ];
}
