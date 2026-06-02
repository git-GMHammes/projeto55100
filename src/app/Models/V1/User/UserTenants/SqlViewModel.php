<?php

namespace App\Models\V1\User\UserTenants;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_user_tenants.
 *
 * A view une user_005_tenants (ut) com user_004_saas_tenants (ust),
 * expondo campos com prefixo ut_ (tenant do usuário) e ust_ (dados do SaaS tenant).
 *
 * Campos disponíveis na view:
 *   id, ut_user_management_id, ut_user_saas_tenants_id, ut_role,
 *   created_at, updated_at, deleted_at,
 *   ust_id, ust_name, ust_slug, ust_plan, ust_active,
 *   ust_created_at, ust_updated_at, ust_deleted_at
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup    = DB_GROUP_001;
    protected $table      = 'view_user_tenants';
    protected $primaryKey = 'id';

    protected array $likeFields = [
        'ut_role',
        'ust_name',
        'ust_slug',
        'ust_plan',
    ];

    protected array $sortableFields = [
        'id',
        'ut_user_management_id',
        'ut_user_saas_tenants_id',
        'ut_role',
        'ust_name',
        'ust_slug',
        'ust_plan',
        'ust_active',
        'created_at',
        'updated_at',
    ];

    public array $searchFields = [
        'ut_role',
        'ust_name',
        'ust_slug',
        'ust_plan',
    ];
}
