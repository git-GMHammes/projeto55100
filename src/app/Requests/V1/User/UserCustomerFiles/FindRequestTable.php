<?php

namespace App\Requests\V1\User\UserCustomerFiles;

/**
 * Regras de validação para POST /find (tabela user_003_customer_files).
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
