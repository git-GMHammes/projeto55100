<?php

namespace App\Services\V1\Eleicao\VotosMunicipio2022;

use App\Models\V1\Eleicao\VotosMunicipio2022\SqlViewModel;
use App\Services\V1\BaseViewService;

/**
 * Service de leitura para o módulo VotosMunicipio2022.
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
