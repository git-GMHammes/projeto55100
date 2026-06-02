<?php

namespace App\Requests\V1\User\UserTenants;

/**
 * Regras de validação para POST /create (tabela user_005_tenants).
 *
 * DDL de referência:
 *   user_management_id  BIGINT NOT NULL  (FK → user_001_management.id)
 *   user_saas_tenants_id BIGINT NOT NULL  (FK → user_004_saas_tenants.id)
 *   role                VARCHAR(50) NOT NULL DEFAULT 'member'
 *
 * Validação de unicidade composta (user_management_id + user_saas_tenants_id) é responsabilidade do Processor.
 */
class CreateRequest
{
    public function rules(): array
    {
        return [
            'user_management_id' => 'required|is_natural_no_zero',
            'user_saas_tenants_id' => 'required|is_natural_no_zero',
            'role'               => 'permit_empty|string|max_length[50]',
        ];
    }

    public function messages(): array
    {
        return [
            'user_management_id' => [
                'required'           => 'O campo user_management_id é obrigatório',
                'is_natural_no_zero' => 'O campo user_management_id deve ser um número inteiro positivo',
            ],
            'user_saas_tenants_id' => [
                'required'           => 'O campo user_saas_tenants_id é obrigatório',
                'is_natural_no_zero' => 'O campo user_saas_tenants_id deve ser um número inteiro positivo',
            ],
            'role' => [
                'max_length' => 'O papel (role) não pode exceder 50 caracteres',
            ],
        ];
    }
}
