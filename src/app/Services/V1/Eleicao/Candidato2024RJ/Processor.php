<?php

namespace App\Services\V1\Eleicao\Candidato2024RJ;

use App\Models\V1\Eleicao\Candidato2024RJ\SqlViewModel;
use App\Services\V1\BaseViewService;

/**
 * Service de leitura para o módulo Candidato2024RJ.
 *
 * Toda a lógica genérica de leitura está em BaseViewService.
 * Este Processor não possui hooks de escrita — módulo somente leitura.
 *
 * Métodos de view: findView, getGroupedView, searchView, getView,
 *                  getAllView, getNoPaginationView, getDeletedView,
 *                  getDeletedAllView, getAllWithDeletedView
 */
class Processor extends BaseViewService
{
    protected SqlViewModel $viewModel;

    public function __construct()
    {
        $this->viewModel = new SqlViewModel();
    }
}
