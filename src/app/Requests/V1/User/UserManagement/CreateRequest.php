<?php

namespace App\Requests\V1\User\UserManagement;

/**
 * Regras de validação para POST /create (tabela user_001_management).
 *
 * Valida o formato e os tipos dos campos conforme o DDL da tabela.
 * A validação de unicidade do campo user é responsabilidade
 * do Processor (Service), pois envolve regra de negócio.
 *
 * DDL de referência:
 *   user     VARCHAR(50)  NOT NULL UNIQUE
 *   password VARCHAR(255) NOT NULL
 */
class CreateRequest
{
    /**
     * Regras de validação CI4.
     *
     * user     → obrigatório, máx. 50 caracteres
     * password → obrigatório, mín. 6 caracteres
     */
    public function rules(): array
    {
        return [
            'user'     => 'required|string|max_length[50]',
            'password' => 'required|string|min_length[5]',
        ];
    }

    /**
     * Mensagens de erro customizadas por campo e regra.
     */
    public function messages(): array
    {
        return [
            'user' => [
                'required'   => 'O campo user é obrigatório',
                'max_length' => 'O campo user não pode exceder 50 caracteres',
            ],
            'password' => [
                'required'   => 'O campo password é obrigatório',
                'min_length' => 'O campo password deve ter no mínimo 5 caracteres',
            ],
        ];
    }
}
