<?php

namespace App\Services\V1\User\UserCustomerFiles;

use App\Models\V1\User\UserCustomerFiles\SqlTableModel;
use App\Models\V1\User\UserCustomerFiles\SqlViewModel;
use App\Services\V1\BaseTableService;
use App\Services\V1\FileUploadService;
use CodeIgniter\HTTP\Files\UploadedFile;

/**
 * Service de negócio para o módulo UserCustomerFiles.
 *
 * Gerencia arquivos vinculados ao perfil do cliente (user_003_customer_files).
 *
 * Métodos de tabela: find, getGrouped, search, get, getAll, getNoPagination,
 *                    getDeleted, getDeletedAll, create, update,
 *                    deleteSoft, deleteRestore, deleteHard, clearDeleted
 *
 * Métodos de view:   findView, getGroupedView, searchView, getView,
 *                    getAllView, getNoPaginationView, getDeletedView, getDeletedAllView
 */
class Processor extends BaseTableService
{
    protected SqlTableModel $tableModel;
    protected SqlViewModel  $viewModel;

    private FileUploadService $fileUploadService;

    public function __construct()
    {
        $this->tableModel        = new SqlTableModel();
        $this->viewModel         = new SqlViewModel();
        $this->fileUploadService = new FileUploadService();
    }

    // -------------------------------------------------------------------------
    // Hooks de validação
    // -------------------------------------------------------------------------

    protected function validateOnCreate(array $data): ?array
    {
        if (!empty($data['user_customer_id']) && !$this->tableModel->existsUserCustomer((int) $data['user_customer_id'])) {
            return ['success' => false, 'message' => 'Cliente não encontrado em user_002_customer', 'code' => 422];
        }

        if (!empty($data['user_saas_tenants_id']) && !$this->tableModel->existsTenant((int) $data['user_saas_tenants_id'])) {
            return ['success' => false, 'message' => 'Tenant não encontrado ou inativo em user_004_saas_tenants', 'code' => 422];
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // Hooks de preparação de dados
    // -------------------------------------------------------------------------

    protected function prepareUpdateData(int $id, array $data): array
    {
        unset($data['user_customer_id']);

        return $data;
    }

    // -------------------------------------------------------------------------
    // Upload de avatar
    // -------------------------------------------------------------------------

    /**
     * Recebe o arquivo de imagem, valida, salva no filesystem e registra
     * em user_003_customer_files.
     *
     * Filename gerado: avatar_{userCustomerId}_{uuid}.{ext}
     * Diretório:       writable/uploads/Projeto56300App/user_customer_files/
     *
     * @param int          $userCustomerId ID do registro em user_002_customer
     * @param UploadedFile $file           Arquivo recebido via multipart
     * @return array{success: bool, data?: array, message?: string, code?: int}
     */
    public function uploadAvatar(int $userCustomerId, UploadedFile $file, int $userSaasTenantId): array
    {
        $result = $this->fileUploadService->uploadFiles(
            $userCustomerId,
            [$file],
            'avatar',
            'avatar',
            5,
            ['image/jpeg', 'image/png', 'image/webp'],
            $userSaasTenantId
        );

        if (isset($result['code'])) {
            return $result;
        }

        $first = $result['results'][0] ?? ['success' => false, 'message' => 'Nenhum arquivo processado'];

        if (!$first['success']) {
            return ['success' => false, 'message' => $first['message'], 'code' => 422];
        }

        return ['success' => true, 'data' => $first['data']];
    }

    // -------------------------------------------------------------------------
    // Upload múltiplo
    // -------------------------------------------------------------------------

    /**
     * Recebe um ou mais arquivos, valida cada um individualmente, salva no
     * filesystem e registra em user_003_customer_files.
     *
     * Filename gerado: arquivo_{userCustomerId}_{uuid}.{ext}
     * Diretório:       writable/uploads/Projeto56300App/user_customer_files/
     *
     * Uploads parciais são permitidos: erro em um arquivo não cancela os demais.
     *
     * @param int            $userCustomerId ID do registro em user_002_customer
     * @param UploadedFile[] $files          Array de arquivos recebidos via multipart
     * @return array{success: bool, results?: array, total?: int, success_count?: int, error_count?: int, message?: string, code?: int}
     */
    public function uploadMultiple(int $userCustomerId, array $files, int $userSaasTenantId): array
    {
        return $this->fileUploadService->uploadFiles(
            $userCustomerId,
            $files,
            'user-customer-files',
            'document',
            10,
            [],
            $userSaasTenantId
        );
    }
}
