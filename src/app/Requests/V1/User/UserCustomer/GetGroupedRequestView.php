<?php

namespace App\Requests\V1\User\UserCustomer;

/**
 * Regras de validação para POST /get-grouped (view v_user_002_customer).
 *
 * O corpo esperado é um objeto JSON onde cada chave é um campo da view
 * e cada valor é um array de strings: { "campo": ["v1", "v2"] }.
 * A validação das chaves dinâmicas é feita diretamente no controller,
 * pois o CI4 não suporta regras com chaves arbitrárias.
 */
class GetGroupedRequestView
{
    public function rules(): array
    {
        return [];
    }
}
