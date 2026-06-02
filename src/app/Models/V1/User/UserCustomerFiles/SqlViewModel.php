<?php

namespace App\Models\V1\User\UserCustomerFiles;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_user_customer_files.
 *
 * A view une user_003_customer_files (ucf), user_002_customer (uc)
 * e user_001_management (um), expondo os dados com prefixos ucf_, uc_ e um_.
 *
 * Campos disponíveis na view:
 *   id, ucf_user_customer_id, ucf_original_name, ucf_filename, ucf_stored_path,
 *   ucf_uuid, ucf_mime, ucf_size, ucf_category, ucf_checksum,
 *   created_at, updated_at, deleted_at,
 *   uc_id, uc_user_id, uc_name, uc_cpf, uc_whatsapp, uc_profile, uc_mail,
 *   um_id, um_uuid, um_user, um_is_active
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup    = DB_GROUP_001;
    protected $table      = 'view_user_customer_files';
    protected $primaryKey = 'id';

    protected array $likeFields = [
        'ucf_original_name',
        'ucf_filename',
        'ucf_stored_path',
        'ucf_mime',
        'ucf_category',
        'uc_name',
        'uc_cpf',
        'uc_mail',
        'uc_whatsapp',
        'um_user',
    ];

    protected array $sortableFields = [
        'id',
        'ucf_original_name',
        'ucf_filename',
        'ucf_category',
        'ucf_size',
        'uc_name',
        'um_user',
        'created_at',
        'updated_at',
    ];

    public array $searchFields = [
        'ucf_original_name',
        'ucf_filename',
        'ucf_category',
        'uc_name',
        'um_user',
    ];
}
