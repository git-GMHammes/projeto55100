<?php

namespace App\Controllers\Api\V1\User\UserCustomer;

use App\Controllers\Api\V1\BaseResourceViewController;
use App\Services\V1\User\UserCustomer\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

/**
 * Controller de recurso para consultas na view v_user_002_customer.
 *
 * Endpoints disponíveis (somente leitura):
 *   find, getGrouped, search, get, getAll, getNoPagination,
 *   getDeleted, getDeletedAll
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
