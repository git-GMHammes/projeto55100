<?php

namespace App\Requests\V1\User\AuthUser;

/**
 * Regras de validação para POST /api/v1/auth/reset-password.
 *
 * Valida o token plain (64 hex chars) e as senhas fornecidas pelo usuário.
 * A verificação de validade e expiração do token é responsabilidade do Processor.
 */
class ResetPasswordRequest
{
    public function rules(): array
    {
        return [
            'token'            => 'required|string|min_length[64]|max_length[64]',
            'password'         => 'required|string|min_length[8]',
            'password_confirm' => 'required|string|matches[password]',
        ];
    }

    public function messages(): array
    {
        return [
            'token' => [
                'required'   => 'O token de recuperação é obrigatório',
                'min_length' => 'Token inválido',
                'max_length' => 'Token inválido',
            ],
            'password' => [
                'required'   => 'A nova senha é obrigatória',
                'min_length' => 'A nova senha deve ter no mínimo 8 caracteres',
            ],
            'password_confirm' => [
                'required' => 'A confirmação de senha é obrigatória',
                'matches'  => 'As senhas não conferem',
            ],
        ];
    }
}
