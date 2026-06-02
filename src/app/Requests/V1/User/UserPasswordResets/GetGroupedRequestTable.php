<?php

namespace App\Requests\V1\User\UserPasswordResets;

/**
 * Regras de validação para POST /get-grouped (tabela user_006_password_resets).
 *
 * Cada chave do body é um campo da tabela; cada valor deve ser um array de strings.
 * A validação de conteúdo interno é feita inline no BaseResourceTableController.
 */
class GetGroupedRequestTable
{
    public function rules(): array
    {
        return [];
    }

    public function messages(): array
    {
        return [];
    }
}
