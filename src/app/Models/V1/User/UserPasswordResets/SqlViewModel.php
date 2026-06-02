<?php

namespace App\Models\V1\User\UserPasswordResets;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_user_006_password_resets (quando existir).
 *
 * Atualmente a tabela user_006_password_resets não possui uma view SQL dedicada.
 * Este model é um placeholder para quando uma view for criada no banco de dados.
 *
 * Para consultas administrativas, utilize SqlTableModel diretamente.
 *
 * Tabela de referência: user_006_password_resets
 * DDL: id, user_id, token_hash, expires_at, used_at, ip_address, user_agent,
 *      created_at, updated_at, deleted_at
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup    = DB_GROUP_001;
    protected $table      = 'user_006_password_resets';
    protected $primaryKey = 'id';

    protected array $likeFields = [
        'ip_address',
        'user_agent',
    ];

    protected array $sortableFields = [
        'id',
        'user_management_id',
        'expires_at',
        'used_at',
        'created_at',
        'updated_at',
    ];

    public array $searchFields = [
        'ip_address',
        'user_agent',
    ];
}
