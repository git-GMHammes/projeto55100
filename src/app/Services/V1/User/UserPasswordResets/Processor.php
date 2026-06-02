<?php

namespace App\Services\V1\User\UserPasswordResets;

use App\Models\V1\User\UserPasswordResets\SqlTableModel;
use App\Services\V1\BaseTableService;

/**
 * Service de negócio para o módulo UserPasswordResets.
 *
 * Toda a lógica genérica (leitura, escrita, exclusão) está em BaseTableService.
 * Este Processor é responsável pelo CRUD administrativo da tabela user_006_password_resets.
 *
 * O fluxo de reset de senha (geração de token, envio de e-mail, aplicação de nova
 * senha) é responsabilidade de AuthUser\Processor, que orquestra múltiplos modelos.
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
}
