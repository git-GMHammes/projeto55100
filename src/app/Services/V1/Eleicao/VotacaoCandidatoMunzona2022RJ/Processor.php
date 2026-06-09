<?php

namespace App\Services\V1\Eleicao\VotacaoCandidatoMunzona2022RJ;

use App\Models\V1\Eleicao\VotacaoCandidatoMunzona2022RJ\SqlViewModel;
use App\Services\V1\BaseViewService;

/**
 * Service de leitura para o módulo VotacaoCandidatoMunzona2022RJ.
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
