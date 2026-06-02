<?php

namespace App\Models\V1\User\UserSaasTenants;

use App\Models\V1\BaseTableModel;

class SqlTableModel extends BaseTableModel
{
    protected $DBGroup = DB_GROUP_001;
    protected $table = 'user_004_saas_tenants';
    protected $primaryKey = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps = true;

    protected $allowedFields = [
        'name',
        'slug',
        'plan',
        'active',
    ];

    protected array $likeFields = [
        'name',
        'slug',
    ];

    protected array $sortableFields = [
        'id',
        'name',
        'slug',
        'plan',
        'active',
        'created_at',
        'updated_at',
    ];

    public array $searchFields = [
        'name',
        'slug',
    ];

    public function existsBySlug(string $slug, ?int $excludeId = null): bool
    {
        return $this->existsByField('slug', $slug, $excludeId);
    }
}
