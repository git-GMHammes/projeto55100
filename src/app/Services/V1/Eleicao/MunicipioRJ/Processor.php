<?php

namespace App\Services\V1\Eleicao\MunicipioRJ;

use App\Models\V1\Eleicao\MunicipioRJ\SqlTableModel;
use App\Services\V1\BaseTableService;

class Processor extends BaseTableService
{
    protected SqlTableModel $tableModel;

    public function __construct()
    {
        $this->tableModel = new SqlTableModel();
    }

    protected function validateOnCreate(array $data): ?array
    {
        if (!empty($data['prefeito_candidato_RJ_id']) && !$this->tableModel->existsByPrefeitoId((int) $data['prefeito_candidato_RJ_id'])) {
            return ['success' => false, 'message' => 'Prefeito candidato não encontrado em candidato_RJ', 'code' => 422];
        }

        return null;
    }

    protected function validateOnUpdate(int $id, array $data): ?array
    {
        if (!empty($data['prefeito_candidato_RJ_id']) && !$this->tableModel->existsByPrefeitoId((int) $data['prefeito_candidato_RJ_id'])) {
            return ['success' => false, 'message' => 'Prefeito candidato não encontrado em candidato_RJ', 'code' => 422];
        }

        return null;
    }

    protected function prepareData(array $data): array
    {
        $dateFields = [
            'aniversario_cidade',
            'vice_dt_nascimento',
            'primeira_dama_dt_nascimento',
            'dt_festa_popular',
            'data_emancipacao',
        ];

        foreach ($dateFields as $field) {
            if (!empty($data[$field])) {
                $data[$field] = $this->formatDate($data[$field]);
            }
        }

        return $data;
    }

    protected function prepareUpdateData(int $id, array $data): array
    {
        return $this->prepareData($data);
    }
}
