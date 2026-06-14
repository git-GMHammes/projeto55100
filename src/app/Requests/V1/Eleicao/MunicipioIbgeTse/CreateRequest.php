<?php

namespace App\Requests\V1\Eleicao\MunicipioIbgeTse;

/**
 * Regras de validação para POST /create (tabela municipio_ibge_tse).
 *
 * DDL de referência:
 *   cd_ibge  CHAR(7)      NOT NULL PK (não auto-increment)
 *   cd_tse   CHAR(5)      DEFAULT NULL
 *   nm_cidade VARCHAR(100) NOT NULL
 */
class CreateRequest
{
    public function rules(): array
    {
        return [
            'cd_ibge'  => 'required|string|max_length[7]',
            'cd_tse'   => 'permit_empty|string|max_length[5]',
            'nm_cidade' => 'required|string|max_length[100]',
        ];
    }

    public function messages(): array
    {
        return [
            'cd_ibge' => [
                'required'   => 'O campo cd_ibge é obrigatório',
                'max_length' => 'O cd_ibge não pode exceder 7 caracteres',
            ],
            'cd_tse' => [
                'max_length' => 'O cd_tse não pode exceder 5 caracteres',
            ],
            'nm_cidade' => [
                'required'   => 'O campo nm_cidade é obrigatório',
                'max_length' => 'O nm_cidade não pode exceder 100 caracteres',
            ],
        ];
    }
}
