<?php

namespace App\Requests\V1\User\UserManagement;

/**
 * Regras de validação para POST /find (tabela user_001_management).
 *
 * Valida o corpo JSON da requisição de busca com filtros.
 * Os parâmetros de paginação (page, limit, sort, order) vêm na query string
 * e são extraídos diretamente no controller — não pertencem a este Request.
 */
class FindRequestTable
{
    /**
     * Regras de validação CI4.
     *
     * "filters" é opcional; se informado, deve ser um array.
     * O conteúdo interno de "filters" é sanitizado no Service.
     */
    public function rules(): array
    {
        return [
            'filters' => 'permit_empty|is_array',
        ];
    }

    /**
     * Mensagens de erro customizadas por campo e regra.
     */
    public function messages(): array
    {
        return [
            'filters' => [
                'is_array' => 'O campo filters deve ser um objeto/array JSON válido',
            ],
        ];
    }
}
