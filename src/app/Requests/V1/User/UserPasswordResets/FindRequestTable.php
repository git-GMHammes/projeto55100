<?php

namespace App\Requests\V1\User\UserPasswordResets;

/**
 * Regras de validação para POST /find (tabela user_006_password_resets).
 *
 * Os parâmetros de paginação (page, limit, sort, order) vêm na query string
 * e são extraídos diretamente no controller — não pertencem a este Request.
 */
class FindRequestTable
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
