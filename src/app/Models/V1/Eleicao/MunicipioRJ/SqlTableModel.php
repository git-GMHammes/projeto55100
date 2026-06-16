<?php

namespace App\Models\V1\Eleicao\MunicipioRJ;

use App\Models\V1\BaseTableModel;

class SqlTableModel extends BaseTableModel
{
    protected $DBGroup          = DB_GROUP_001;
    protected $table            = 'municipio_RJ';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $useSoftDeletes   = false;
    protected $useTimestamps    = false;

    protected $allowedFields = [
        'cd_ibge',
        'cd_tse',
        'nome_cidade',
        'aniversario_cidade',
        'prefeito_candidato_RJ_id',
        'vice_prefeito',
        'vice_dt_nascimento',
        'primeira_dama',
        'primeira_dama_dt_nascimento',
        'festa_popular',
        'dt_festa_popular',
        'populacao',
        'eleitores',
        'densidade_demografica',
        'crescimento_populacional',
        'populacao_urbana',
        'populacao_rural',
        'pib_municipal',
        'pib_per_capita',
        'receita_orcamentaria',
        'despesa_orcamentaria',
        'arrecadacao_propria',
        'empresas_ativas',
        'empregos_formais',
        'idhm',
        'indice_gini',
        'percentual_pobres',
        'bolsa_familia_benef',
        'ideb_anos_iniciais',
        'ideb_anos_finais',
        'taxa_analfabetismo',
        'matriculas_creche',
        'distorcao_idade_serie',
        'mortalidade_infantil',
        'cobertura_saude_familia',
        'leitos_por_habitante',
        'esperanca_vida',
        'acesso_agua_tratada',
        'acesso_esgoto',
        'coleta_lixo_adequada',
        'acesso_internet',
        'deficit_habitacional',
        'superlotacao',
        'favelas_subnormais',
        'taxa_homicidios',
        'num_roubos_furtos',
        'area_vegetacao',
        'risco_enchente',
        'data_emancipacao',
        'area_territorial',
    ];

    protected array $likeFields = [
        'cd_ibge',
        'cd_tse',
        'nome_cidade',
        'vice_prefeito',
        'primeira_dama',
        'festa_popular',
    ];

    protected array $sortableFields = [
        'id',
        'cd_ibge',
        'cd_tse',
        'nome_cidade',
        'populacao',
        'eleitores',
        'pib_municipal',
        'pib_per_capita',
        'idhm',
        'area_territorial',
    ];

    public array $searchFields = [
        'nome_cidade',
        'vice_prefeito',
        'primeira_dama',
        'festa_popular',
        'cd_ibge',
        'cd_tse',
    ];

    public function existsByPrefeitoId(int $prefeitoId): bool
    {
        return $this->db->table('candidato_RJ')
            ->where('id', $prefeitoId)
            ->countAllResults() > 0;
    }
}
