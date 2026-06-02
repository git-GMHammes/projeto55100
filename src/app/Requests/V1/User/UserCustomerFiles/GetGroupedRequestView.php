<?php

namespace App\Requests\V1\User\UserCustomerFiles;

/**
 * Regras de validação para POST /get-grouped (view view_user_customer_files).
 *
 * As chaves do body são dinâmicas (campos da view) — validação feita no controller.
 */
class GetGroupedRequestView
{
    public function rules(): array
    {
        return [];
    }
}
