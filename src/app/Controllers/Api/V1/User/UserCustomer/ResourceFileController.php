<?php

namespace App\Controllers\Api\V1\User\UserCustomer;

use App\Controllers\Api\V1\BaseResourceTableController;
use App\Libraries\FileUploadLibrary;
use App\Requests\V1\User\UserCustomerFiles\CreateRequest;
use App\Requests\V1\User\UserCustomerFiles\UpdateRequest;
use App\Requests\V1\User\UserCustomerFiles\UploadAvatarRequest;
use App\Requests\V1\User\UserCustomerFiles\UploadFileRequest;
use App\Services\V1\User\UserCustomerFiles\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

/**
 * Controller de arquivos do cliente — namespace UserCustomer.
 *
 * CRUD completo (14 endpoints) herdado de BaseResourceTableController via Processor.
 * Upload delegado diretamente para FileUploadLibrary, sem passar pelo Processor.
 *
 * Rotas disponíveis em /user-customer-file/:
 *   POST   upload-avatar/{id}  — imagem de perfil (jpeg/png/webp, max 5MB)
 *   POST   upload-file/{id}    — arquivo geral (qualquer tipo, max 10MB)
 *   + 14 endpoints REST padrão (find, get, create, update, delete-soft, etc.)
 */
class ResourceFileController extends BaseResourceTableController
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

    /**
     * POST .../upload-avatar/{id}
     *
     * Multipart: campo "file" (imagem JPEG, PNG ou WebP, max 5MB).
     * Body:      user_saas_tenants_id (obrigatório).
     *
     * Salva em: usu_{id}/user-customer-file/file_upload_{uuid}.{ext}
     * Registra em: user_003_customer_files com category = 'avatar'.
     */
    public function uploadAvatar(int $id): ResponseInterface
    {
        try {
            $file = $this->request->getFile('file');

            if (!$file || !$file->isValid()) {
                return $this->respondValidationError(['file' => 'Arquivo inválido ou não enviado']);
            }

            $body     = $this->getRequestBody();
            $tenantId = (int) ($body['user_saas_tenants_id'] ?? 0);

            if ($tenantId <= 0) {
                return $this->respondValidationError(['user_saas_tenants_id' => 'Informe user_saas_tenants_id no body da requisição']);
            }

            $constraints = new UploadAvatarRequest();
            $library     = new FileUploadLibrary();

            $result = $library->upload($id, $constraints->moduleSlug(), [$file], $constraints, $tenantId);

            if (!$result['success'] && isset($result['code'])) {
                return $this->respondError($result['message'], $result['code']);
            }

            $first = $result['results'][0] ?? ['success' => false, 'message' => 'Nenhum arquivo processado'];

            if (!$first['success']) {
                return $this->respondError($first['message'], 422);
            }

            return $this->respondSuccess($first['data'], 'Avatar enviado com sucesso');
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        }
    }

    /**
     * POST .../upload-file/{id}
     *
     * Multipart: campo "files[]" (um ou mais arquivos de qualquer tipo, max 10MB cada).
     * Body:      user_saas_tenants_id (obrigatório).
     *
     * Salva em: usu_{id}/user-customer-file/file_upload_{uuid}.{ext}
     * Registra em: user_003_customer_files com category = 'document'.
     * Uploads parciais são permitidos — a resposta detalha o resultado por arquivo.
     */
    public function uploadFile(int $id): ResponseInterface
    {
        try {
            $files = $this->request->getFiles();
            $files = $files['files'] ?? [];

            if (empty($files)) {
                return $this->respondValidationError(['files' => 'Nenhum arquivo enviado. Use o campo files[] no multipart/form-data']);
            }

            $body     = $this->getRequestBody();
            $tenantId = (int) ($body['user_saas_tenants_id'] ?? 0);

            if ($tenantId <= 0) {
                return $this->respondValidationError(['user_saas_tenants_id' => 'Informe user_saas_tenants_id no body da requisição']);
            }

            $constraints = new UploadFileRequest();
            $library     = new FileUploadLibrary();

            $result = $library->upload($id, $constraints->moduleSlug(), $files, $constraints, $tenantId);

            if (!$result['success'] && isset($result['code'])) {
                return $this->respondError($result['message'], $result['code']);
            }

            return $this->respondSuccess([
                'results'       => $result['results'],
                'total'         => $result['total'],
                'success_count' => $result['success_count'],
                'error_count'   => $result['error_count'],
            ], 'Upload processado');
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        }
    }
}
