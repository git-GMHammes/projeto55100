<?php

namespace App\Requests\V1\Eleicao\Candidato2024RJ;

/**
 * Regras de validação para POST /get-grouped (tabela candidato_2024_RJ).
 *
 * O corpo esperado é um objeto JSON onde cada chave é um campo da tabela
 * e cada valor é um array de strings: { "campo": ["v1", "v2"] }.
 * A validação das chaves dinâmicas é feita diretamente no controller.
 */
class GetGroupedRequestTable
{
    public function rules(): array
    {
        return [];
    }
}
