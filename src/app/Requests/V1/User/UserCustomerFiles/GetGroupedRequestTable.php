<?php

namespace App\Requests\V1\User\UserCustomerFiles;

/**
 * Regras de validação para POST /get-grouped (tabela user_003_customer_files).
 *
 * As chaves do body são dinâmicas (campos da tabela) — validação feita no controller.
 */
class GetGroupedRequestTable
{
    public function rules(): array
    {
        return [];
    }
}
