<?php

namespace App\Requests\V1\User\UserTenants;

/**
 * Regras de validação para PUT /update/{id} (tabela user_005_tenants).
 *
 * Apenas role pode ser alterado após a criação.
 * user_id e tenant_id são imutáveis — o Processor os remove no update.
 */
class UpdateRequest
{
    public function rules(): array
    {
        return [
            'role' => 'permit_empty|string|max_length[50]',
        ];
    }

    public function messages(): array
    {
        return [
            'role' => [
                'max_length' => 'O papel (role) não pode exceder 50 caracteres',
            ],
        ];
    }
}
