<?php

namespace App\Controllers\Api\V1\User\UserManagement;

use App\Controllers\Api\V1\BaseResourceTableController;
use App\Requests\V1\User\UserManagement\CreateRequest;
use App\Requests\V1\User\UserManagement\UpdateRequest;
use App\Services\V1\User\UserManagement\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

/**
 * Controller de recurso para operações diretas na tabela user_001_management.
 *
 * Todos os 14 endpoints REST estão implementados em BaseResourceTableController.
 * Este controller declara apenas o Processor e as regras de validação do módulo.
 */
class ResourceTableController extends BaseResourceTableController
{
    public function initController(
        RequestInterface $request,
        ResponseInterface $response,
        LoggerInterface $logger
    ): void {
        parent::initController($request, $response, $logger);
        $this->processor = new Processor();
    }

    protected function getCreateRules(): array
    {
        return (new CreateRequest())->rules();
    }

    protected function getUpdateRules(): array
    {
        return (new UpdateRequest())->rules();
    }
}
