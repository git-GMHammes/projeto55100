<?php

namespace App\Requests\V1\Eleicao\Partidos2022RJ;

/**
 * Regras de validação para PUT /update/{id} (tabela partidos_2022_RJ).
 *
 * O ID (PK) é passado na URL — não deve constar no corpo da requisição.
 * Todos os campos são permit_empty (atualização parcial aceita).
 */
class UpdateRequest
{
    public function rules(): array
    {
        return [
            'NR_PARTIDO' => 'permit_empty|string|max_length[10]',
            'SG_PARTIDO' => 'permit_empty|string|max_length[50]',
            'NM_PARTIDO' => 'permit_empty|string|max_length[255]',
        ];
    }

    public function messages(): array
    {
        return [
            'NR_PARTIDO' => [
                'max_length' => 'NR_PARTIDO não pode exceder 10 caracteres',
            ],
            'SG_PARTIDO' => [
                'max_length' => 'SG_PARTIDO não pode exceder 50 caracteres',
            ],
            'NM_PARTIDO' => [
                'max_length' => 'NM_PARTIDO não pode exceder 255 caracteres',
            ],
        ];
    }
}
