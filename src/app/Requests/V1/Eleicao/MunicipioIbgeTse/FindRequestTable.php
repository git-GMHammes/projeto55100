<?php

namespace App\Requests\V1\Eleicao\MunicipioIbgeTse;

/**
 * Regras de validação para POST /find (tabela municipio_ibge_tse).
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
