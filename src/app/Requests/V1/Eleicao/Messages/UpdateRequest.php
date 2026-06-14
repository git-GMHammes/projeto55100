<?php

namespace App\Requests\V1\Eleicao\Messages;

/**
 * Regras de validação para PUT /update/{id} (tabela messages).
 *
 * O id (PK) é passado na URL — não deve constar no corpo da requisição.
 * Todos os campos são permit_empty (atualização parcial aceita).
 */
class UpdateRequest
{
    public function rules(): array
    {
        return [
            'username' => 'permit_empty|string|max_length[50]',
            'message'  => 'permit_empty|string',
        ];
    }

    public function messages(): array
    {
        return [
            'username' => [
                'max_length' => 'O username não pode exceder 50 caracteres',
            ],
        ];
    }
}
