<?php

namespace App\Requests\V1\Eleicao\MunicipioIbgeTse;

/**
 * Regras de validação para PUT /update/{id} (tabela municipio_ibge_tse).
 *
 * O cd_ibge (PK) é passado na URL — não deve constar no corpo da requisição.
 * Todos os campos são permit_empty (atualização parcial aceita).
 */
class UpdateRequest
{
    public function rules(): array
    {
        return [
            'cd_tse'   => 'permit_empty|string|max_length[5]',
            'nm_cidade' => 'permit_empty|string|max_length[100]',
        ];
    }

    public function messages(): array
    {
        return [
            'cd_tse' => [
                'max_length' => 'O cd_tse não pode exceder 5 caracteres',
            ],
            'nm_cidade' => [
                'max_length' => 'O nm_cidade não pode exceder 100 caracteres',
            ],
        ];
    }
}
