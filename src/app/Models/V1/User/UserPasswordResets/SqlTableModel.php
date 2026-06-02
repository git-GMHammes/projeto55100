<?php

namespace App\Models\V1\User\UserPasswordResets;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela user_006_password_resets.
 *
 * Responsável por todas as operações CRUD diretas na tabela física.
 *
 * Tabela: user_006_password_resets
 * DDL: id, user_id, token_hash, expires_at, used_at, ip_address,
 *      user_agent, created_at, updated_at, deleted_at
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup = DB_GROUP_001;
    protected $table = 'user_006_password_resets';
    protected $primaryKey = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps = true;

    /**
     * Campos que podem ser inseridos/atualizados via Model.
     * Exclui: id (PK), created_at/updated_at/deleted_at (timestamps).
     */
    protected $allowedFields = [
        'user_management_id',
        'token_hash',
        'expires_at',
        'used_at',
        'ip_address',
        'user_agent',
    ];

    /**
     * Campos de texto que usam LIKE %valor% no find.
     * Exclui: user_id (FK int), token_hash (hash SHA-256 — busca exata), datas.
     */
    protected array $likeFields = [
        'ip_address',
        'user_agent',
    ];

    /** Campos válidos para ordenação */
    protected array $sortableFields = [
        'id',
        'user_management_id',
        'expires_at',
        'used_at',
        'created_at',
        'updated_at',
    ];

    /** Campos utilizados na busca textual (GET /search) */
    public array $searchFields = [
        'ip_address',
        'user_agent',
    ];

    // -------------------------------------------------------------------------
    // Métodos específicos do fluxo de reset de senha
    // -------------------------------------------------------------------------

    /**
     * Busca um token ativo: não utilizado, não expirado e não soft-deleted.
     *
     * @param string $hash SHA-256 do token plain recebido pelo usuário
     */
    public function findActiveByTokenHash(string $hash): ?array
    {
        return $this->where('token_hash', $hash)
                    ->where('used_at IS NULL', null, false)
                    ->where('expires_at >', date('Y-m-d H:i:s'))
                    ->first();
    }

    /**
     * Invalida (soft-delete) todos os tokens pendentes de um usuário.
     * Chamado antes de emitir um novo token para evitar tokens órfãos ativos.
     *
     * @param int $userId ID do usuário em user_001_management
     */
    public function softDeleteActiveByUserId(int $userId): void
    {
        $this->db->table($this->table)
                 ->where('user_management_id', $userId)
                 ->where('used_at IS NULL', null, false)
                 ->where('expires_at >', date('Y-m-d H:i:s'))
                 ->where('deleted_at IS NULL', null, false)
                 ->update(['deleted_at' => date('Y-m-d H:i:s')]);
    }

    /**
     * Marca o token como utilizado, impedindo reuso.
     *
     * @param int $id PK do registro em user_006_password_resets
     */
    public function markAsUsed(int $id): void
    {
        $this->db->table($this->table)
                 ->where($this->primaryKey, $id)
                 ->update(['used_at' => date('Y-m-d H:i:s')]);
    }
}
