<?php

namespace App\Services\V1\Eleicao\MandatarioRJ;

use App\Models\V1\Eleicao\MandatarioRJ\SqlTableModel;
use App\Models\V1\Eleicao\MandatarioRJ\SqlViewModel;
use App\Services\V1\BaseTableService;

class Processor extends BaseTableService
{
    protected SqlTableModel $tableModel;
    protected SqlViewModel  $viewModel;

    public function __construct()
    {
        $this->tableModel = new SqlTableModel();
        $this->viewModel  = new SqlViewModel();
    }

    protected function prepareData(array $data): array
    {
        if (!empty($data['dt_nascimento'])) {
            $data['dt_nascimento'] = $this->formatDate($data['dt_nascimento']);
        }

        return $data;
    }

    protected function prepareUpdateData(int $id, array $data): array
    {
        return $this->prepareData($data);
    }
}
