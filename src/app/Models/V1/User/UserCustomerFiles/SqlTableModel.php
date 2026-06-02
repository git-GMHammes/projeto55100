<?php

namespace App\Models\V1\User\UserCustomerFiles;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela user_003_customer_files.
 *
 * Responsável por todas as operações CRUD diretas na tabela física.
 *
 * Tabela: user_003_customer_files
 * DDL: id, user_customer_id, original_name, filename, stored_path,
 *      uuid, mime, size, category, checksum, created_at, updated_at, deleted_at
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup      = DB_GROUP_001;
    protected $table        = 'user_003_customer_files';
    protected $primaryKey   = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps  = true;

    protected $allowedFields = [
        'user_saas_tenants_id',
        'user_customer_id',
        'original_name',
        'filename',
        'stored_path',
        'uuid',
        'mime',
        'size',
        'category',
        'checksum',
    ];

    protected array $likeFields = [
        'original_name',
        'filename',
        'stored_path',
        'mime',
        'category',
    ];

    protected array $sortableFields = [
        'id',
        'user_saas_tenants_id',
        'original_name',
        'filename',
        'category',
        'size',
        'created_at',
        'updated_at',
    ];

    public array $searchFields = [
        'original_name',
        'filename',
        'category',
    ];

    public function existsUserCustomer(int $userCustomerId): bool
    {
        return $this->db->table('user_002_customer')
            ->where('id', $userCustomerId)
            ->where('deleted_at IS NULL', null, false)
            ->countAllResults() > 0;
    }

    public function existsTenant(int $tenantId): bool
    {
        return $this->db->table('user_004_saas_tenants')
            ->where('id', $tenantId)
            ->where('active', 1)
            ->where('deleted_at IS NULL', null, false)
            ->countAllResults() > 0;
    }
}
