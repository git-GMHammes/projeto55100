<?php

namespace App\Requests\V1\Eleicao\Partidos2022RJ;

/**
 * Regras de validação para POST /create (tabela partidos_2022_RJ).
 *
 * DDL de referência:
 *   ID         INT UNSIGNED AUTO_INCREMENT PK
 *   NR_PARTIDO VARCHAR(10)  DEFAULT NULL
 *   SG_PARTIDO VARCHAR(50)  NOT NULL
 *   NM_PARTIDO VARCHAR(255) NOT NULL
 */
class CreateRequest
{
    public function rules(): array
    {
        return [
            'NR_PARTIDO' => 'permit_empty|string|max_length[10]',
            'SG_PARTIDO' => 'required|string|max_length[50]',
            'NM_PARTIDO' => 'required|string|max_length[255]',
        ];
    }

    public function messages(): array
    {
        return [
            'NR_PARTIDO' => [
                'max_length' => 'NR_PARTIDO não pode exceder 10 caracteres',
            ],
            'SG_PARTIDO' => [
                'required'   => 'O campo SG_PARTIDO é obrigatório',
                'max_length' => 'SG_PARTIDO não pode exceder 50 caracteres',
            ],
            'NM_PARTIDO' => [
                'required'   => 'O campo NM_PARTIDO é obrigatório',
                'max_length' => 'NM_PARTIDO não pode exceder 255 caracteres',
            ],
        ];
    }
}
