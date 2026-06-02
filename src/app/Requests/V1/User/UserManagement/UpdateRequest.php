<?php

namespace App\Requests\V1\User\UserManagement;

/**
 * Regras de validação para PUT /update/{id} (tabela user_001_management).
 *
 * Todos os campos são opcionais (permit_empty), pois o PUT parcial é aceito.
 * A validação de unicidade do campo user é responsabilidade
 * do Processor (Service), pois depende do ID atual para exclusão correta.
 */
class UpdateRequest
{
    /**
     * Regras de validação CI4 para atualização.
     *
     * user     → opcional, máx. 50 caracteres
     * password → opcional, mín. 6 caracteres
     */
    public function rules(): array
    {
        return [
            'user'     => 'permit_empty|string|max_length[50]',
            'password' => 'permit_empty|string|min_length[5]',
        ];
    }

    /**
     * Mensagens de erro customizadas por campo e regra.
     */
    public function messages(): array
    {
        return [
            'user' => [
                'max_length' => 'O campo user não pode exceder 50 caracteres',
            ],
            'password' => [
                'min_length' => 'O campo password deve ter no mínimo 5 caracteres',
            ],
        ];
    }
}
