<?php

namespace App\Requests\V1\Eleicao\MunicipioRJ;

class UpdateRequest
{
    public function rules(): array
    {
        return [
            'cd_ibge'                      => 'permit_empty|string|max_length[10]',
            'cd_tse'                       => 'permit_empty|string|max_length[10]',
            'nome_cidade'                  => 'permit_empty|string|max_length[200]',
            'aniversario_cidade'           => 'permit_empty|valid_date[Y-m-d]',
            'prefeito_candidato_RJ_id'     => 'permit_empty|is_natural_no_zero',
            'vice_prefeito'                => 'permit_empty|string|max_length[200]',
            'vice_dt_nascimento'           => 'permit_empty|valid_date[Y-m-d]',
            'primeira_dama'                => 'permit_empty|string|max_length[200]',
            'primeira_dama_dt_nascimento'  => 'permit_empty|valid_date[Y-m-d]',
            'festa_popular'                => 'permit_empty|string|max_length[200]',
            'dt_festa_popular'             => 'permit_empty|valid_date[Y-m-d]',
            'populacao'                    => 'permit_empty|integer',
            'eleitores'                    => 'permit_empty|integer',
            'densidade_demografica'        => 'permit_empty|decimal',
            'crescimento_populacional'     => 'permit_empty|decimal',
            'populacao_urbana'             => 'permit_empty|integer',
            'populacao_rural'              => 'permit_empty|integer',
            'pib_municipal'                => 'permit_empty|decimal',
            'pib_per_capita'               => 'permit_empty|decimal',
            'receita_orcamentaria'         => 'permit_empty|decimal',
            'despesa_orcamentaria'         => 'permit_empty|decimal',
            'arrecadacao_propria'          => 'permit_empty|decimal',
            'empresas_ativas'              => 'permit_empty|integer',
            'empregos_formais'             => 'permit_empty|integer',
            'idhm'                         => 'permit_empty|decimal',
            'indice_gini'                  => 'permit_empty|decimal',
            'percentual_pobres'            => 'permit_empty|decimal',
            'bolsa_familia_benef'          => 'permit_empty|integer',
            'ideb_anos_iniciais'           => 'permit_empty|decimal',
            'ideb_anos_finais'             => 'permit_empty|decimal',
            'taxa_analfabetismo'           => 'permit_empty|decimal',
            'matriculas_creche'            => 'permit_empty|integer',
            'distorcao_idade_serie'        => 'permit_empty|decimal',
            'mortalidade_infantil'         => 'permit_empty|decimal',
            'cobertura_saude_familia'      => 'permit_empty|decimal',
            'leitos_por_habitante'         => 'permit_empty|decimal',
            'esperanca_vida'               => 'permit_empty|decimal',
            'acesso_agua_tratada'          => 'permit_empty|decimal',
            'acesso_esgoto'                => 'permit_empty|decimal',
            'coleta_lixo_adequada'         => 'permit_empty|decimal',
            'acesso_internet'              => 'permit_empty|decimal',
            'deficit_habitacional'         => 'permit_empty|integer',
            'superlotacao'                 => 'permit_empty|decimal',
            'favelas_subnormais'           => 'permit_empty|integer',
            'taxa_homicidios'              => 'permit_empty|decimal',
            'num_roubos_furtos'            => 'permit_empty|integer',
            'area_vegetacao'               => 'permit_empty|decimal',
            'risco_enchente'               => 'permit_empty|in_list[0,1]',
            'data_emancipacao'             => 'permit_empty|valid_date[Y-m-d]',
            'area_territorial'             => 'permit_empty|decimal',
        ];
    }

    public function messages(): array
    {
        return [
            'prefeito_candidato_RJ_id' => [
                'is_natural_no_zero' => 'O prefeito_candidato_RJ_id deve ser um inteiro positivo',
            ],
            'risco_enchente' => [
                'in_list' => 'O campo risco_enchente aceita apenas 0 ou 1',
            ],
        ];
    }
}
