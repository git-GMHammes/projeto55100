<?php

namespace App\Requests\V1\User\UserCustomerFiles;

/**
 * Regras de validação para POST /create (tabela user_003_customer_files).
 *
 * Validações de existência de FK (user_customer_id) são responsabilidade
 * do Processor, pois envolvem consulta ao banco.
 *
 * DDL de referência:
 *   user_customer_id  BIGINT NOT NULL
 *   original_name     VARCHAR(255) NOT NULL
 *   filename          VARCHAR(255) NOT NULL
 *   stored_path       VARCHAR(255) NOT NULL UNIQUE
 *   uuid              CHAR(32)
 *   mime              VARCHAR(100)
 *   size              INT UNSIGNED
 *   category          VARCHAR(100)
 *   checksum          CHAR(64)
 */
class CreateRequest
{
    public function rules(): array
    {
        return [
            'user_saas_tenants_id' => 'required|is_natural_no_zero',
            'user_customer_id'     => 'required|is_natural_no_zero',
            'original_name'    => 'required|string|max_length[255]',
            'filename'         => 'required|string|max_length[255]',
            'stored_path'      => 'required|string|max_length[255]',
            'uuid'             => 'permit_empty|string|max_length[32]',
            'mime'             => 'permit_empty|string|max_length[100]',
            'size'             => 'permit_empty|is_natural',
            'category'         => 'permit_empty|string|max_length[100]',
            'checksum'         => 'permit_empty|string|max_length[64]',
        ];
    }

    public function messages(): array
    {
        return [
            'user_saas_tenants_id' => [
                'is_natural_no_zero' => 'O campo user_saas_tenants_id deve ser um número inteiro positivo',
            ],
            'user_customer_id' => [
                'required'           => 'O campo user_customer_id é obrigatório',
                'is_natural_no_zero' => 'O campo user_customer_id deve ser um número inteiro positivo',
            ],
            'original_name' => [
                'required'   => 'O nome original do arquivo é obrigatório',
                'max_length' => 'O nome original não pode exceder 255 caracteres',
            ],
            'filename' => [
                'required'   => 'O filename é obrigatório',
                'max_length' => 'O filename não pode exceder 255 caracteres',
            ],
            'stored_path' => [
                'required'   => 'O stored_path é obrigatório',
                'max_length' => 'O stored_path não pode exceder 255 caracteres',
            ],
            'uuid'     => ['max_length' => 'O uuid não pode exceder 32 caracteres'],
            'mime'     => ['max_length' => 'O mime não pode exceder 100 caracteres'],
            'size'     => ['is_natural' => 'O size deve ser um número inteiro não negativo'],
            'category' => ['max_length' => 'A category não pode exceder 100 caracteres'],
            'checksum' => ['max_length' => 'O checksum não pode exceder 64 caracteres'],
        ];
    }
}
