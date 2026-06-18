<?php

namespace App\Services\V1\Eleicao\MunicipioIbgeTse;

use App\Models\V1\Eleicao\MunicipioIbgeTse\SqlTableModel;
use App\Services\V1\BaseTableService;

class Processor extends BaseTableService
{
    protected SqlTableModel $tableModel;

    public function __construct()
    {
        $this->tableModel = new SqlTableModel();
    }

    protected function prepareUpdateData(int $id, array $data): array
    {
        // cd_ibge é PK imutável — nunca deve ser alterada via update
        unset($data['cd_ibge']);

        return $data;
    }
}
