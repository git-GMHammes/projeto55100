<?php

namespace App\Requests\V1\User\UserTenants;

/**
 * Regras de validação para POST /find (view view_user_tenants).
 *
 * Campos disponíveis para filtro na view:
 *   id, ut_user_id, ut_tenant_id, ut_role,
 *   created_at, updated_at, deleted_at,
 *   ust_id, ust_name, ust_slug, ust_plan, ust_active
 */
class FindRequestView
{
    public function rules(): array
    {
        return [
            'filters' => 'permit_empty|is_array',
        ];
    }

    public function messages(): array
    {
        return [
            'filters' => [
                'is_array' => 'O campo filters deve ser um objeto/array JSON válido',
            ],
        ];
    }
}
