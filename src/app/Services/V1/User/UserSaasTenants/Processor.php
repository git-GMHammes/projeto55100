<?php

namespace App\Services\V1\User\UserSaasTenants;

use App\Models\V1\User\UserSaasTenants\SqlTableModel;
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
        if (!empty($data['slug']) && $this->tableModel->existsBySlug($data['slug'])) {
            return ['success' => false, 'message' => 'Slug já cadastrado', 'code' => 409];
        }

        return null;
    }

    protected function validateOnUpdate(int $id, array $data): ?array
    {
        if (!empty($data['slug']) && $this->tableModel->existsBySlug($data['slug'], $id)) {
            return ['success' => false, 'message' => 'Slug já cadastrado', 'code' => 409];
        }

        return null;
    }
}
