<?php

namespace App\Models\V1\User\UserCustomer;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela user_002_customer.
 *
 * Responsável por todas as operações CRUD diretas na tabela física.
 * Inclui verificações de unicidade para CPF, WhatsApp e e-mail,
 * respeitando os registros com soft delete.
 *
 * Tabela: user_002_customer
 * DDL: id, user_id, name, cpf, whatsapp, profile, mail, phone,
 *      date_birth, zip_code, address, tenant_at, validity, created_at, updated_at, deleted_at, user_id_active (generated)
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup = DB_GROUP_001;
    protected $table = 'user_002_customer';
    protected $primaryKey = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps = true;

    /**
     * Campos que podem ser inseridos/atualizados via Model.
     * Exclui: id (PK), created_at/updated_at/deleted_at (timestamps), user_id_active (coluna gerada).
     */
    protected $allowedFields = [
        'user_management_id',
        'is_active',
        'name',
        'cpf',
        'whatsapp',
        'profile',
        'mail',
        'phone',
        'date_birth',
        'zip_code',
        'address',
        'tenant_at',
        'validity',
    ];

    /**
     * Campos de texto que usam LIKE %valor% no find.
     * Campos relacionais/numéricos (id, user_id, datas) usam WHERE exato.
     */
    protected array $likeFields = [
        'name',
        'cpf',
        'whatsapp',
        'phone',
        'mail',
        'address',
        'profile',
        'zip_code',
        'tenant_at',

    ];

    /** Campos válidos para ordenação */
    protected array $sortableFields = [
        'id',
        'is_active',
        'user_management_id',
        'name',
        'cpf',
        'mail',
        'whatsapp',
        'date_birth',
        'validity',
        'created_at',
        'updated_at',
    ];

    /** Campos utilizados na busca textual (GET /search) */
    public array $searchFields = [
        'name',
        'cpf',
        'mail',
        'whatsapp',
        'phone',
        'address',
        'tenant_at',
    ];

    // -------------------------------------------------------------------------
    // Verificações de unicidade (ignora registros soft-deleted)
    // -------------------------------------------------------------------------

    /**
     * Alias semântico para existsByField aplicado ao campo 'cpf'.
     */
    public function existsByCpf(string $cpf, ?int $excludeId = null): bool
    {
        return $this->existsByField('cpf', $cpf, $excludeId);
    }

    /**
     * Alias semântico para existsByField aplicado ao campo 'whatsapp'.
     */
    public function existsByWhatsapp(string $whatsapp, ?int $excludeId = null): bool
    {
        return $this->existsByField('whatsapp', $whatsapp, $excludeId);
    }

    /**
     * Alias semântico para existsByField aplicado ao campo 'mail'.
     */
    public function existsByMail(string $mail, ?int $excludeId = null): bool
    {
        return $this->existsByField('mail', $mail, $excludeId);
    }

    // -------------------------------------------------------------------------
    // Verificações de integridade referencial
    // -------------------------------------------------------------------------

    /**
     * Verifica se o user_id existe na tabela pai user_001_management (registro ativo).
     *
     * Usado antes do insert para evitar violação de FK e retornar erro controlado.
     *
     * @param int $userId ID a verificar em user_001_management
     */
    public function existsUserManagement(int $userId): bool
    {
        return $this->db->table('user_001_management')
            ->where('id', $userId)
            ->where('deleted_at IS NULL', null, false)
            ->countAllResults() > 0;
    }
}
