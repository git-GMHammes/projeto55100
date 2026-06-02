<?php

namespace App\Services\V1\User\UserManagement;

use App\Models\V1\User\UserManagement\SqlTableModel;
use App\Services\V1\BaseTableService;

/**
 * Service de negócio para o módulo UserManagement.
 *
 * Toda a lógica genérica (leitura, escrita, exclusão) está em BaseService.
 * Este Processor sobrescreve apenas os hooks específicos do módulo:
 * unicidade de username e hash bcrypt da senha.
 *
 * Métodos: find, getGrouped, search, get, getAll, getNoPagination,
 *          getDeleted, getDeletedAll, create, update,
 *          deleteSoft, deleteRestore, deleteHard, clearDeleted
 */
class Processor extends BaseTableService
{
    protected SqlTableModel $tableModel;

    public function __construct()
    {
        $this->tableModel = new SqlTableModel();
    }

    // -------------------------------------------------------------------------
    // Hooks de validação
    // -------------------------------------------------------------------------

    /**
     * Valida unicidade do username entre registros ativos antes do insert.
     */
    protected function validateOnCreate(array $data): ?array
    {
        if (!empty($data['user']) && $this->tableModel->existsByUser($data['user'])) {
            return ['success' => false, 'message' => 'Username já cadastrado', 'code' => 409];
        }

        return null;
    }

    /**
     * Valida unicidade do username antes do update, excluindo o próprio registro.
     */
    protected function validateOnUpdate(int $id, array $data): ?array
    {
        if (!empty($data['user']) && $this->tableModel->existsByUser($data['user'], $id)) {
            return ['success' => false, 'message' => 'Username já cadastrado', 'code' => 409];
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // Hook de preparação de dados
    // -------------------------------------------------------------------------

    /**
     * Aplica hash bcrypt na senha antes da persistência.
     */
    protected function prepareData(array $data): array
    {
        if (!empty($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        }

        if (empty($data['uuid'])) {
            $data['uuid'] = uuid();
        }

        return $data;
    }
}
