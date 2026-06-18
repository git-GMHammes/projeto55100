<?php

namespace App\Models\V1\Eleicao\MandatarioRJ;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para mandatario_RJ.
 * Não existe view_mandatario_RJ no banco — lê diretamente da tabela.
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup    = DB_GROUP_001;
    protected $table      = 'mandatario_RJ';
    protected $primaryKey = 'id';

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
