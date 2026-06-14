<?php

namespace App\Requests\V1\Eleicao\Candidato2022RJ;

/**
 * Regras de validação para PUT /update/{id} (tabela candidato_2022_RJ).
 *
 * O id (PK) é passado na URL — não deve constar no corpo da requisição.
 * Todos os campos são permit_empty (atualização parcial aceita).
 */
class UpdateRequest
{
    public function rules(): array
    {
        return [
            'NR_MUNICIPIO'              => 'permit_empty|string|max_length[100]',
            'NM_MUNICIPIO'              => 'permit_empty|string|max_length[100]',
            'NR_CANDIDATO'              => 'permit_empty|string|max_length[10]',
            'NM_CANDIDATO'              => 'permit_empty|string|max_length[150]',
            'SG_PARTIDO'                => 'permit_empty|string|max_length[20]',
            'NM_PARTIDO'                => 'permit_empty|string|max_length[100]',
            'QT_VOTOS_NOMINAIS_VALIDOS' => 'permit_empty|is_natural',
        ];
    }

    public function messages(): array
    {
        return [
            'NR_MUNICIPIO' => [
                'max_length' => 'NR_MUNICIPIO não pode exceder 100 caracteres',
            ],
            'NM_MUNICIPIO' => [
                'max_length' => 'NM_MUNICIPIO não pode exceder 100 caracteres',
            ],
            'NR_CANDIDATO' => [
                'max_length' => 'NR_CANDIDATO não pode exceder 10 caracteres',
            ],
            'NM_CANDIDATO' => [
                'max_length' => 'NM_CANDIDATO não pode exceder 150 caracteres',
            ],
            'SG_PARTIDO' => [
                'max_length' => 'SG_PARTIDO não pode exceder 20 caracteres',
            ],
            'NM_PARTIDO' => [
                'max_length' => 'NM_PARTIDO não pode exceder 100 caracteres',
            ],
            'QT_VOTOS_NOMINAIS_VALIDOS' => [
                'is_natural' => 'QT_VOTOS_NOMINAIS_VALIDOS deve ser um número inteiro não negativo',
            ],
        ];
    }
}
