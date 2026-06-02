<?php

namespace App\Requests\V1\User\UserCustomer;

/**
 * Regras de validação para POST /find (view v_user_002_customer).
 *
 * Valida o corpo JSON da requisição de busca com filtros na view.
 * Os parâmetros de paginação (page, limit, sort, order) vêm na query string
 * e são extraídos diretamente no controller — não pertencem a este Request.
 *
 * Os campos válidos para filtro na view são os expostos pelo SELECT:
 *   id, uc_id, um_user, uc_user_id, uc_name, uc_cpf, uc_whatsapp,
 *   uc_profile, uc_mail, uc_phone, uc_date_birth, uc_zip_code,
 *   uc_address, created_at, updated_at, deleted_at
 */
class FindRequestView
{
    /**
     * Regras de validação CI4.
     *
     * "filters" é opcional; se informado, deve ser um array.
     * O conteúdo interno de "filters" é sanitizado no Service.
     */
    public function rules(): array
    {
        return [
            'filters' => 'permit_empty|is_array',
        ];
    }

    /**
     * Mensagens de erro customizadas por campo e regra.
     */
    public function messages(): array
    {
        return [
            'filters' => [
                'is_array' => 'O campo filters deve ser um objeto/array JSON válido',
            ],
        ];
    }
}
