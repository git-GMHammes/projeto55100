<?php

namespace App\Requests\V1\User\AuthUser;

/**
 * Regras de validação para POST /find (view view_auth_user).
 *
 * Valida o corpo JSON da requisição de busca com filtros na view.
 * Os parâmetros de paginação (page, limit, sort, order) vêm na query string
 * e são extraídos diretamente no controller — não pertencem a este Request.
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
