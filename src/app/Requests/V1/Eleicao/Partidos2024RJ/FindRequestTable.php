<?php

namespace App\Requests\V1\Eleicao\Partidos2024RJ;

/**
 * Regras de validação para POST /find (tabela partidos_2024_RJ).
 *
 * "filters" é opcional; se informado, deve ser um array.
 * O conteúdo interno de "filters" é sanitizado no Service.
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
