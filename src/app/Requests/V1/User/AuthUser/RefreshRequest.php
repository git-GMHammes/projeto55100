<?php

namespace App\Requests\V1\User\AuthUser;

class RefreshRequest
{
    public function rules(): array
    {
        return [
            'refresh_token' => 'required|string|min_length[64]|max_length[64]',
        ];
    }

    public function messages(): array
    {
        return [
            'refresh_token' => [
                'required'   => 'O refresh token é obrigatório',
                'min_length' => 'Refresh token inválido',
                'max_length' => 'Refresh token inválido',
            ],
        ];
    }
}
