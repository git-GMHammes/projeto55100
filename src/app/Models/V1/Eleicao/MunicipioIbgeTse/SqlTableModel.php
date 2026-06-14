<?php

namespace App\Models\V1\Eleicao\MunicipioIbgeTse;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela municipio_ibge_tse.
 *
 * Tabela: municipio_ibge_tse
 * DDL: cd_ibge (char(7) PK), cd_tse (char(5)), nm_cidade (varchar(100))
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup          = DB_GROUP_001;
    protected $table            = 'municipio_ibge_tse';
    protected $primaryKey       = 'cd_ibge';
    protected $useAutoIncrement = false;
    protected $useSoftDeletes   = false;
    protected $useTimestamps    = false;

    /**
     * cd_ibge incluído pois a PK não é auto-increment e deve ser fornecida no insert.
     */
    protected $allowedFields = [
        'cd_ibge',
        'cd_tse',
        'nm_cidade',
    ];

    protected array $likeFields = [
        'cd_ibge',
        'cd_tse',
        'nm_cidade',
    ];

    protected array $sortableFields = [
        'cd_ibge',
        'cd_tse',
        'nm_cidade',
    ];

    public array $searchFields = [
        'cd_ibge',
        'cd_tse',
        'nm_cidade',
    ];
}
