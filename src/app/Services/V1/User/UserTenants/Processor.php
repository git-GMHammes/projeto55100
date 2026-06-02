<?php

namespace App\Services\V1\User\UserTenants;

use App\Models\V1\User\UserTenants\SqlTableModel;
use App\Models\V1\User\UserTenants\SqlViewModel;
use App\Services\V1\BaseTableService;

/**
 * Service de negócio para o módulo UserTenants.
 *
 * Regras do módulo:
 *   - A combinação (user_management_id + user_saas_tenants_id) deve ser única entre registros ativos.
 *   - Após a criação, user_management_id e user_saas_tenants_id são imutáveis — apenas role pode ser atualizado.
 */
class Processor extends BaseTableService
{
    protected SqlTableModel $tableModel;
    protected SqlViewModel  $viewModel;

    public function __construct()
    {
        $this->tableModel = new SqlTableModel();
        $this->viewModel  = new SqlViewModel();
    }

    protected function validateOnCreate(array $data): ?array
    {
        $userId   = isset($data['user_management_id']) ? (int) $data['user_management_id'] : 0;
        $tenantId = isset($data['user_saas_tenants_id']) ? (int) $data['user_saas_tenants_id'] : 0;

        if ($userId > 0 && $tenantId > 0 && $this->tableModel->existsByUserAndTenant($userId, $tenantId)) {
            return ['success' => false, 'message' => 'Este usuário já está vinculado a este tenant', 'code' => 409];
        }

        return null;
    }

    protected function prepareUpdateData(int $id, array $data): array
    {
        unset($data['user_management_id'], $data['user_saas_tenants_id']);

        return $data;
    }
}
