<?php

namespace App\Models\V1\User\UserCustomer;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_customer.
 *
 * Responsável exclusivamente por consultas (read-only).
 * A view une user_002_customer (uc) com user_001_management (um),
 * expondo os dados com prefixo uc_ para campos do cliente
 * e usando os timestamps de user_001_management.
 *
 * Campos disponíveis na view:
 *   id, uc_id, um_user, uc_user_id, uc_name, uc_cpf, uc_whatsapp,
 *   uc_profile, uc_mail, uc_phone, uc_date_birth, uc_zip_code,
 *   uc_address, uc_tenant_at, uc_validity, created_at, updated_at, deleted_at
 *
 * O campo deleted_at reflete user_001_management.deleted_at.
 *
 * Todos os métodos de leitura (findPaginatedView, findById, findDeletedById,
 * findDeletedPaginatedView, searchByTermView, findGroupedView, findAllView)
 * estão disponíveis via BaseViewModel.
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup = DB_GROUP_001;
    protected $table = 'view_customer';
    protected $primaryKey = 'id';

    /**
     * Campos de texto que usam LIKE %valor% no findPaginatedView.
     */
    protected array $likeFields = [
        'um_user',
        'uc_name',
        'um_is_active',
        'uc_cpf',
        'uc_whatsapp',
        'uc_phone',
        'uc_mail',
        'uc_address',
        'uc_profile',
        'uc_zip_code',
        'uc_tenant_at',

    ];

    /** Campos válidos para ordenação */
    protected array $sortableFields = [
        'id',
        'uc_id',
        'um_user',
        'uc_name',
        'um_is_active',
        'uc_cpf',
        'uc_mail',
        'uc_whatsapp',
        'uc_validity',
        'created_at',
        'updated_at',
    ];

    /** Campos utilizados na busca textual (GET /search) */
    public array $searchFields = [
        'um_user',
        'uc_name',
        'uc_cpf',
        'uc_mail',
        'uc_whatsapp',
        'uc_phone',
        'uc_address',
        'uc_tenant_at',
    ];
}
