<?php

namespace App\Requests\V1\Eleicao\Messages;

/**
 * Regras de validação para POST /create (tabela messages).
 *
 * DDL de referência:
 *   id         INT UNSIGNED AUTO_INCREMENT PK
 *   username   VARCHAR(50) NOT NULL
 *   message    TEXT NOT NULL
 *   created_at DATETIME DEFAULT CURRENT_TIMESTAMP (gerenciado pelo banco)
 */
class CreateRequest
{
    public function rules(): array
    {
        return [
            'username' => 'required|string|max_length[50]',
            'message'  => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'username' => [
                'required'   => 'O campo username é obrigatório',
                'max_length' => 'O username não pode exceder 50 caracteres',
            ],
            'message' => [
                'required' => 'O campo message é obrigatório',
            ],
        ];
    }
}
