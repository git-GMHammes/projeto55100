<?php

namespace App\Models\V1\Eleicao\VotacaoCandidatoMunzona2024RJ;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_votacao_candidato_munzona_2024_RJ_group.
 *
 * Campos disponíveis na view:
 *   ID, CD_MUNICIPIO, NM_MUNICIPIO, DS_CARGO, SG_PARTIDO, NM_PARTIDO,
 *   NR_VOTAVEL, NM_VOTAVEL, QT_VOTOS
 *
 * Todos os métodos de leitura estão disponíveis via BaseViewModel.
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup = DB_GROUP_001;
    protected $table = 'view_votacao_candidato_munzona_2024_RJ_group';
    protected $primaryKey = 'ID';

    /** Campos de texto que usam LIKE %valor% no findPaginatedView. */
    protected array $likeFields = [
        'NM_MUNICIPIO',
        'DS_CARGO',
        'SG_PARTIDO',
        'NM_PARTIDO',
        'NR_VOTAVEL',
        'NM_VOTAVEL',
    ];

    /** Campos válidos para ordenação */
    protected array $sortableFields = [
        'ID',
        'CD_MUNICIPIO',
        'NM_MUNICIPIO',
        'DS_CARGO',
        'SG_PARTIDO',
        'NM_PARTIDO',
        'NR_VOTAVEL',
        'NM_VOTAVEL',
        'QT_VOTOS',
    ];

    /** Campos utilizados na busca textual (GET /search) */
    public array $searchFields = [
        'NM_MUNICIPIO',
        'DS_CARGO',
        'SG_PARTIDO',
        'NM_PARTIDO',
        'NR_VOTAVEL',
        'NM_VOTAVEL',
    ];
}
