<?php

namespace App\Models\V1\User\UserTenants;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela user_005_tenants.
 *
 * Tabela: user_005_tenants
 * DDL: id, user_management_id (FK→user_001_management), user_saas_tenants_id (FK→user_004_saas_tenants),
 *      role, created_at, updated_at, deleted_at
 * Unique: (user_management_id, user_saas_tenants_id)
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup = DB_GROUP_001;
    protected $table = 'user_005_tenants';
    protected $primaryKey = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps = true;

    protected $allowedFields = [
        'user_management_id',
        'user_saas_tenants_id',
        'role',
    ];

    /** user_management_id e user_saas_tenants_id são FKs inteiras — busca exata; apenas role usa LIKE */
    protected array $likeFields = [
        'role',
    ];

    protected array $sortableFields = [
        'id',
        'user_management_id',
        'user_saas_tenants_id',
        'role',
        'created_at',
        'updated_at',
    ];

    public array $searchFields = [
        'role',
    ];

    /**
     * Verifica se já existe vínculo ativo entre o usuário e o tenant informados.
     * Usado pelo Processor para validar a restrição de unicidade composta.
     */
    public function existsByUserAndTenant(int $userId, int $tenantId, ?int $excludeId = null): bool
    {
        $builder = $this->db->table($this->table)
            ->where('user_management_id', $userId)
            ->where('user_saas_tenants_id', $tenantId)
            ->where('deleted_at IS NULL', null, false);

        if ($excludeId !== null) {
            $builder->where('id !=', $excludeId);
        }

        return $builder->countAllResults() > 0;
    }
}
