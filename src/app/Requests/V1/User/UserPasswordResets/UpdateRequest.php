<?php

namespace App\Requests\V1\User\UserPasswordResets;

/**
 * Regras de validação para PUT /update/{id} (tabela user_006_password_resets).
 *
 * Apenas campos mutáveis após a criação são permitidos.
 * user_id, token_hash e expires_at são imutáveis (auditoria).
 */
class UpdateRequest
{
    public function rules(): array
    {
        return [
            'used_at'    => 'permit_empty|string',
            'ip_address' => 'permit_empty|string|max_length[45]',
            'user_agent' => 'permit_empty|string|max_length[255]',
        ];
    }

    public function messages(): array
    {
        return [
            'ip_address' => [
                'max_length' => 'O campo ip_address não pode exceder 45 caracteres',
            ],
            'user_agent' => [
                'max_length' => 'O campo user_agent não pode exceder 255 caracteres',
            ],
        ];
    }
}
