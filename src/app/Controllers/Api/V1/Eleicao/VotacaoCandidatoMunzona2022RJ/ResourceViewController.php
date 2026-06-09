<?php

namespace App\Controllers\Api\V1\Eleicao\VotacaoCandidatoMunzona2022RJ;

use App\Controllers\Api\V1\BaseResourceViewController;
use App\Services\V1\Eleicao\VotacaoCandidatoMunzona2022RJ\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

/**
 * Controller de recurso para consultas na view view_votacao_candidato_munzona_2022_RJ_group.
 *
 * Endpoints disponíveis (somente leitura):
 *   find, getGrouped, search, get, getAll, getNoPagination,
 *   getDeleted, getDeletedAll, getAllWithDeleted
 *
 * Toda a orquestração dos endpoints está em BaseResourceViewController.
 * Nenhuma operação de escrita está disponível neste controller.
 */
class ResourceViewController extends BaseResourceViewController
{
    public function initController(
        RequestInterface $request,
        ResponseInterface $response,
        LoggerInterface $logger
    ): void {
        parent::initController($request, $response, $logger);
        $this->processor = new Processor();
    }
}
