<?php

namespace App\Requests\V1\User\UserCustomerFiles;

/**
 * Regras de validação para PUT /update/{id} (tabela user_003_customer_files).
 *
 * Todos os campos são opcionais no update.
 * O campo user_customer_id é ignorado no update pelo Processor (campo imutável).
 */
class UpdateRequest
{
    public function rules(): array
    {
        return [
            'original_name' => 'permit_empty|string|max_length[255]',
            'filename'      => 'permit_empty|string|max_length[255]',
            'stored_path'   => 'permit_empty|string|max_length[255]',
            'uuid'          => 'permit_empty|string|max_length[32]',
            'mime'          => 'permit_empty|string|max_length[100]',
            'size'          => 'permit_empty|is_natural',
            'category'      => 'permit_empty|string|max_length[100]',
            'checksum'      => 'permit_empty|string|max_length[64]',
        ];
    }

    public function messages(): array
    {
        return [
            'original_name' => ['max_length' => 'O nome original não pode exceder 255 caracteres'],
            'filename'      => ['max_length' => 'O filename não pode exceder 255 caracteres'],
            'stored_path'   => ['max_length' => 'O stored_path não pode exceder 255 caracteres'],
            'uuid'          => ['max_length' => 'O uuid não pode exceder 32 caracteres'],
            'mime'          => ['max_length' => 'O mime não pode exceder 100 caracteres'],
            'size'          => ['is_natural' => 'O size deve ser um número inteiro não negativo'],
            'category'      => ['max_length' => 'A category não pode exceder 100 caracteres'],
            'checksum'      => ['max_length' => 'O checksum não pode exceder 64 caracteres'],
        ];
    }
}
