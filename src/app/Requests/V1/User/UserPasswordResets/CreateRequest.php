<?php

namespace App\Requests\V1\User\UserPasswordResets;

/**
 * Regras de validação para POST /create (tabela user_006_password_resets).
 *
 * Uso administrativo — o fluxo de reset padrão cria os registros via AuthUser/Processor.
 *
 * DDL de referência:
 *   user_id    BIGINT       NOT NULL  — FK user_001_management.id
 *   token_hash VARCHAR(64)  NOT NULL  — SHA-256 do token plain (nunca armazenar plain text)
 *   expires_at DATETIME     NOT NULL  — Expiração do token
 *   used_at    DATETIME     NULL      — Quando o token foi utilizado
 *   ip_address VARCHAR(45)  NULL      — IPv4 ou IPv6 da solicitação
 *   user_agent VARCHAR(255) NULL      — Navegador/dispositivo
 */
class CreateRequest
{
    public function rules(): array
    {
        return [
            'user_management_id'    => 'required|is_natural_no_zero',
            'token_hash' => 'required|string|min_length[64]|max_length[64]',
            'expires_at' => 'required|string',
            'used_at'    => 'permit_empty|string',
            'ip_address' => 'permit_empty|string|max_length[45]',
            'user_agent' => 'permit_empty|string|max_length[255]',
        ];
    }

    public function messages(): array
    {
        return [
            'user_management_id' => [
                'required'            => 'O campo user_management_id é obrigatório',
                'is_natural_no_zero'  => 'O campo user_management_id deve ser um inteiro positivo',
            ],
            'token_hash' => [
                'required'   => 'O campo token_hash é obrigatório',
                'min_length' => 'O token_hash deve ter exatamente 64 caracteres (SHA-256)',
                'max_length' => 'O token_hash deve ter exatamente 64 caracteres (SHA-256)',
            ],
            'expires_at' => [
                'required' => 'O campo expires_at é obrigatório',
            ],
            'ip_address' => [
                'max_length' => 'O campo ip_address não pode exceder 45 caracteres',
            ],
            'user_agent' => [
                'max_length' => 'O campo user_agent não pode exceder 255 caracteres',
            ],
        ];
    }
}
