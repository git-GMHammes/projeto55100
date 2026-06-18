<?php

namespace App\Controllers\Api\V1\Eleicao\MandatarioRJ;

use App\Controllers\Api\V1\BaseResourceViewController;
use App\Services\V1\Eleicao\MandatarioRJ\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

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
