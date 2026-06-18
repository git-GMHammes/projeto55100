<?php

namespace App\Models\V1\Eleicao\MandatarioRJ;

use App\Models\V1\BaseTableModel;

class SqlTableModel extends BaseTableModel
{
    protected $DBGroup          = DB_GROUP_001;
    protected $table            = 'mandatario_RJ';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $useSoftDeletes   = false;
    protected $useTimestamps    = false;

    protected $allowedFields = [
        'candidato_2022_RJ_id',
        'candidato_2024_RJ_id',
        'cargo_politico',
        'suplente_candidato_RJ_id',
        'ocupa_instituicao',
        'cargo_instituicao',
        'partido_politico',
        'nome_politico',
        'dt_nascimento',
        'municipio_mandato',
        'whatsapp',
        'youtube',
        'facebook',
        'instagram',
        'email',
        'qtd_votos',
    ];

    protected array $likeFields = [
        'nome_politico',
        'cargo_politico',
        'partido_politico',
        'municipio_mandato',
        'ocupa_instituicao',
        'cargo_instituicao',
        'email',
    ];

    protected array $sortableFields = [
        'id',
        'nome_politico',
        'cargo_politico',
        'partido_politico',
        'municipio_mandato',
        'dt_nascimento',
        'qtd_votos',
    ];

    public array $searchFields = [
        'nome_politico',
        'cargo_politico',
        'partido_politico',
        'municipio_mandato',
        'ocupa_instituicao',
        'cargo_instituicao',
        'email',
        'whatsapp',
    ];
}
