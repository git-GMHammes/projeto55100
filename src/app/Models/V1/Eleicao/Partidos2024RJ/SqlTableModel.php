<?php

namespace App\Models\V1\Eleicao\Partidos2024RJ;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela partidos_2024_RJ.
 *
 * Tabela: partidos_2024_RJ
 * DDL: ID (int PK auto), NR_PARTIDO, SG_PARTIDO, NM_PARTIDO
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup        = DB_GROUP_001;
    protected $table          = 'partidos_2024_RJ';
    protected $primaryKey     = 'ID';
    protected $useSoftDeletes = false;
    protected $useTimestamps  = false;

    protected $allowedFields = [
        'NR_PARTIDO',
        'SG_PARTIDO',
        'NM_PARTIDO',
    ];

    protected array $likeFields = [
        'NR_PARTIDO',
        'SG_PARTIDO',
        'NM_PARTIDO',
    ];

    protected array $sortableFields = [
        'ID',
        'NR_PARTIDO',
        'SG_PARTIDO',
        'NM_PARTIDO',
    ];

    public array $searchFields = [
        'NR_PARTIDO',
        'SG_PARTIDO',
        'NM_PARTIDO',
    ];
}
