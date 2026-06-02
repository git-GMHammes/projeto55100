<?php

namespace App\Models\V1\User\UserManagement;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela user_001_management.
 *
 * Responsável por todas as operações CRUD diretas na tabela física.
 *
 * Tabela: user_001_management
 * DDL: id, uuid, user, password, last_login, created_at, updated_at, deleted_at
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup = DB_GROUP_001;
    protected $table = 'user_001_management';
    protected $primaryKey = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps = true;

    /**
     * Campos excluídos de qualquer retorno de consulta via Model.
     * Evita exposição acidental de dados sensíveis nas respostas da API.
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Campos que podem ser inseridos/atualizados via Model.
     * Exclui: id (PK), created_at/updated_at/deleted_at (timestamps).
     */
    protected $allowedFields = [
        'uuid',
        'user',
        'password',
        'last_login',
    ];

    /**
     * Campos de texto que usam LIKE %valor% no find.
     */
    protected array $likeFields = [
        'user',
    ];

    /** Campos válidos para ordenação */
    protected array $sortableFields = [
        'id',
        'user',
        'last_login',
        'created_at',
        'updated_at',
    ];

    /** Campos utilizados na busca textual (GET /search) */
    public array $searchFields = [
        'user',
    ];

    /**
     * Alias semântico para existsByField aplicado ao campo 'user'.
     *
     * @param string   $user      Username a verificar
     * @param int|null $excludeId ID a ignorar (usado no update)
     */
    public function existsByUser(string $user, ?int $excludeId = null): bool
    {
        return $this->existsByField('user', $user, $excludeId);
    }
}
