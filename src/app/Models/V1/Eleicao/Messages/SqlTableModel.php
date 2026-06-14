<?php

namespace App\Models\V1\Eleicao\Messages;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela messages.
 *
 * Tabela: messages
 * DDL: id (int PK auto), username, message, created_at (DEFAULT CURRENT_TIMESTAMP)
 *
 * created_at é gerenciado pelo banco via DEFAULT — não incluído em allowedFields.
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup        = DB_GROUP_001;
    protected $table          = 'messages';
    protected $primaryKey     = 'id';
    protected $useSoftDeletes = false;
    protected $useTimestamps  = false;

    protected $allowedFields = [
        'username',
        'message',
    ];

    protected array $likeFields = [
        'username',
        'message',
    ];

    protected array $sortableFields = [
        'id',
        'username',
        'created_at',
    ];

    public array $searchFields = [
        'username',
        'message',
    ];
}
