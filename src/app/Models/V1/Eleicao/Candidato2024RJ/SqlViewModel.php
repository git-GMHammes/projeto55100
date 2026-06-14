<?php

namespace App\Models\V1\Eleicao\Candidato2024RJ;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_candidato_2024_RJ.
 *
 * Campos disponíveis na view:
 *   ID, CD_MUNICIPIO, NM_MUNICIPIO, NR_VOTAVEL, NM_VOTAVEL,
 *   SG_PARTIDO, NM_PARTIDO, QT_VOTOS_NOMINAIS_VALIDOS
 *
 * Todos os métodos de leitura estão disponíveis via BaseViewModel.
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup = DB_GROUP_001;
    protected $table = 'view_candidato_2024_RJ';
    protected $primaryKey = 'ID';

    /** Campos de texto que usam LIKE %valor% no findPaginatedView. */
    protected array $likeFields = [
        'NM_MUNICIPIO',
        'NR_VOTAVEL',
        'NM_VOTAVEL',
        'SG_PARTIDO',
        'NM_PARTIDO',
    ];

    /** Campos válidos para ordenação */
    protected array $sortableFields = [
        'ID',
        'CD_MUNICIPIO',
        'NM_MUNICIPIO',
        'NR_VOTAVEL',
        'NM_VOTAVEL',
        'SG_PARTIDO',
        'NM_PARTIDO',
        'QT_VOTOS_NOMINAIS_VALIDOS',
    ];

    /** Campos utilizados na busca textual (GET /search) */
    public array $searchFields = [
        'NM_MUNICIPIO',
        'NR_VOTAVEL',
        'NM_VOTAVEL',
        'SG_PARTIDO',
        'NM_PARTIDO',
    ];
}
