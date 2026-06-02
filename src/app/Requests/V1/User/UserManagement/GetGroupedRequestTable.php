<?php

namespace App\Requests\V1\User\UserManagement;

/**
 * Regras de validação para POST /get-grouped (tabela user_001_management).
 *
 * O corpo esperado é um objeto JSON onde cada chave é um campo da tabela
 * e cada valor é um array de strings: { "campo": ["v1", "v2"] }.
 * A validação das chaves dinâmicas é feita diretamente no controller,
 * pois o CI4 não suporta regras com chaves arbitrárias.
 */
class GetGroupedRequestTable
{
    public function rules(): array
    {
        return [];
    }
}
