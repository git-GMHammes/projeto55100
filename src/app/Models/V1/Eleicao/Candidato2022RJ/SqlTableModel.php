<?php

namespace App\Models\V1\Eleicao\Candidato2022RJ;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela candidato_2022_RJ.
 *
 * Tabela: candidato_2022_RJ
 * DDL: id (varchar PK), NR_MUNICIPIO, NM_MUNICIPIO, NR_CANDIDATO,
 *      NM_CANDIDATO, SG_PARTIDO, NM_PARTIDO, QT_VOTOS_NOMINAIS_VALIDOS
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup          = DB_GROUP_001;
    protected $table            = 'candidato_2022_RJ';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $useSoftDeletes   = false;
    protected $useTimestamps    = false;

    /**
     * id incluído pois a PK não é auto-increment e deve ser fornecida no insert.
     */
    protected $allowedFields = [
        'id',
        'NR_MUNICIPIO',
        'NM_MUNICIPIO',
        'NR_CANDIDATO',
        'NM_CANDIDATO',
        'SG_PARTIDO',
        'NM_PARTIDO',
        'QT_VOTOS_NOMINAIS_VALIDOS',
    ];

    protected array $likeFields = [
        'NM_MUNICIPIO',
        'NR_CANDIDATO',
        'NM_CANDIDATO',
        'SG_PARTIDO',
        'NM_PARTIDO',
    ];

    protected array $sortableFields = [
        'id',
        'NR_MUNICIPIO',
        'NM_MUNICIPIO',
        'NR_CANDIDATO',
        'NM_CANDIDATO',
        'SG_PARTIDO',
        'NM_PARTIDO',
        'QT_VOTOS_NOMINAIS_VALIDOS',
    ];

    public array $searchFields = [
        'NM_MUNICIPIO',
        'NR_CANDIDATO',
        'NM_CANDIDATO',
        'SG_PARTIDO',
        'NM_PARTIDO',
    ];
}
