<?php

namespace App\Models\V1\Eleicao\Partidos2024RJ;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_partidos_2024_RJ.
 *
 * Campos disponíveis na view:
 *   SG_PARTIDO, NM_PARTIDO
 *
 * Esta view não possui coluna ID — SG_PARTIDO é usado como chave primária.
 * Todos os métodos de leitura estão disponíveis via BaseViewModel.
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup = DB_GROUP_001;
    protected $table = 'view_partidos_2024_RJ';
    protected $primaryKey = 'SG_PARTIDO';

    /** Campos de texto que usam LIKE %valor% no findPaginatedView. */
    protected array $likeFields = [
        'SG_PARTIDO',
        'NM_PARTIDO',
    ];

    /** Campos válidos para ordenação */
    protected array $sortableFields = [
        'SG_PARTIDO',
        'NM_PARTIDO',
    ];

    /** Campos utilizados na busca textual (GET /search) */
    public array $searchFields = [
        'SG_PARTIDO',
        'NM_PARTIDO',
    ];
}
