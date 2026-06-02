<?php

namespace App\Requests\V1\User\UserCustomer;

/**
 * Regras de validação para PUT /update/{id} (tabela user_002_customer).
 *
 * Todos os campos são opcionais (permit_empty), pois o PUT parcial é aceito.
 * Validações de unicidade (CPF, WhatsApp, e-mail) são responsabilidade
 * do Processor (Service), pois dependem do ID atual para exclusão correta.
 *
 * user_id não é permitido no update — o vínculo com user_001_management
 * não pode ser alterado após a criação.
 */
class UpdateRequest
{
    /**
     * Regras de validação CI4 para atualização.
     *
     * name       → opcional, máx. 150 caracteres (VARCHAR 150)
     * cpf        → opcional, máx. 50 caracteres (VARCHAR 50)
     * whatsapp   → opcional, máx. 50 caracteres (VARCHAR 50)
     * profile    → opcional, máx. 200 caracteres (VARCHAR 200)
     * mail       → opcional, formato e-mail válido, máx. 150 caracteres (VARCHAR 150)
     * phone      → opcional, máx. 50 caracteres (VARCHAR 50)
     * date_birth → opcional, formato Y-m-d (DATE)
     * zip_code   → opcional, máx. 50 caracteres (VARCHAR 50)
     * address    → opcional, máx. 50 caracteres (VARCHAR 50)
     * tenant_at  → opcional, máx. 200 caracteres (VARCHAR 200)
     * validity   → opcional, formato Y-m-d H:i:s (DATETIME)
     */
    public function rules(): array
    {
        return [
            'name' => 'permit_empty|string|max_length[150]',
            'cpf' => 'permit_empty|string|max_length[50]',
            'whatsapp' => 'permit_empty|string|max_length[50]',
            'profile' => 'permit_empty|string|max_length[200]',
            'mail' => 'permit_empty|valid_email|max_length[150]',
            'phone' => 'permit_empty|string|max_length[50]',
            'date_birth' => 'permit_empty|valid_date[Y-m-d]',
            'zip_code' => 'permit_empty|string|max_length[50]',
            'address' => 'permit_empty|string|max_length[50]',
            'tenant_at' => 'permit_empty|string|max_length[200]',
            'validity' => 'permit_empty|string|max_length[30]',
        ];
    }

    /**
     * Mensagens de erro customizadas por campo e regra.
     */
    public function messages(): array
    {
        return [
            'name' => [
                'max_length' => 'O nome não pode exceder 150 caracteres',
            ],
            'cpf' => [
                'max_length' => 'O CPF não pode exceder 50 caracteres',
            ],
            'whatsapp' => [
                'max_length' => 'O WhatsApp não pode exceder 50 caracteres',
            ],
            'profile' => [
                'max_length' => 'O perfil não pode exceder 200 caracteres',
            ],
            'mail' => [
                'valid_email' => 'Informe um endereço de e-mail válido',
                'max_length' => 'O e-mail não pode exceder 150 caracteres',
            ],
            'phone' => [
                'max_length' => 'O telefone não pode exceder 50 caracteres',
            ],
            'date_birth' => [
                'valid_date' => 'A data de nascimento deve estar no formato Y-m-d (ex: 1990-12-31)',
            ],
            'zip_code' => [
                'max_length' => 'O CEP não pode exceder 50 caracteres',
            ],
            'address' => [
                'max_length' => 'O endereço não pode exceder 50 caracteres',
            ],
            'tenant_at' => [
                'max_length' => 'O sistema de acesso não pode exceder 200 caracteres',
            ],
            'validity' => [
                'max_length' => 'A validade não pode exceder 30 caracteres',
            ],
        ];
    }
}
