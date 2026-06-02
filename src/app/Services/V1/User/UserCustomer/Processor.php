<?php

namespace App\Services\V1\User\UserCustomer;

use App\Models\V1\User\UserCustomer\SqlTableModel;
use App\Models\V1\User\UserCustomer\SqlViewModel;
use App\Services\V1\BaseTableService;

/**
 * Service de negócio para o módulo UserCustomer.
 *
 * Toda a lógica genérica (leitura, escrita, exclusão) está em BaseService.
 * Este Processor sobrescreve apenas os hooks específicos do módulo:
 * validação de FK/unicidade e formatação dos campos de data.
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

    public function __construct()
    {
        $this->tableModel = new SqlTableModel();
        $this->viewModel  = new SqlViewModel();
    }

    // -------------------------------------------------------------------------
    // Hooks de validação
    // -------------------------------------------------------------------------

    /**
     * Validações antes do insert:
     *   - FK obrigatória com user_001_management
     *   - Unicidade de CPF, WhatsApp e e-mail entre registros ativos
     */
    protected function validateOnCreate(array $data): ?array
    {
        if (!empty($data['user_management_id']) && !$this->tableModel->existsUserManagement((int) $data['user_management_id'])) {
            return ['success' => false, 'message' => 'Usuário não encontrado em user_001_management', 'code' => 422];
        }

        if (!empty($data['cpf']) && $this->tableModel->existsByCpf($data['cpf'])) {
            return ['success' => false, 'message' => 'CPF já cadastrado', 'code' => 409];
        }

        if (!empty($data['whatsapp']) && $this->tableModel->existsByWhatsapp($data['whatsapp'])) {
            return ['success' => false, 'message' => 'WhatsApp já cadastrado', 'code' => 409];
        }

        if (!empty($data['mail']) && $this->tableModel->existsByMail($data['mail'])) {
            return ['success' => false, 'message' => 'E-mail já cadastrado', 'code' => 409];
        }

        return null;
    }

    /**
     * Validações antes do update:
     *   - Unicidade de CPF, WhatsApp e e-mail excluindo o próprio registro
     */
    protected function validateOnUpdate(int $id, array $data): ?array
    {
        if (!empty($data['cpf']) && $this->tableModel->existsByCpf($data['cpf'], $id)) {
            return ['success' => false, 'message' => 'CPF já cadastrado', 'code' => 409];
        }

        if (!empty($data['whatsapp']) && $this->tableModel->existsByWhatsapp($data['whatsapp'], $id)) {
            return ['success' => false, 'message' => 'WhatsApp já cadastrado', 'code' => 409];
        }

        if (!empty($data['mail']) && $this->tableModel->existsByMail($data['mail'], $id)) {
            return ['success' => false, 'message' => 'E-mail já cadastrado', 'code' => 409];
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // Hooks de preparação de dados
    // -------------------------------------------------------------------------

    /**
     * Formata date_birth (Y-m-d) e validity (Y-m-d H:i:s) antes da persistência.
     */
    protected function prepareData(array $data): array
    {
        if (isset($data['date_birth'])) {
            $data['date_birth'] = $this->formatDate($data['date_birth']);
        }

        if (isset($data['validity'])) {
            $data['validity'] = $this->formatDatetime($data['validity']);
        }

        return $data;
    }

    /**
     * Remove o vínculo imutável user_id e delega a formatação de datas para prepareData.
     */
    protected function prepareUpdateData(int $id, array $data): array
    {
        unset($data['user_management_id']);

        return $this->prepareData($data);
    }

    // -------------------------------------------------------------------------
    // Upload de avatar
    // -------------------------------------------------------------------------

    /**
     * Recebe o arquivo de imagem enviado via multipart, valida tipo/tamanho,
     * salva em writable/uploads/avatars/, registra em user_003_customer_files
     * e atualiza o campo profile em user_002_customer.
     *
     * @param int                                     $customerId ID do registro em user_002_customer
     * @param \CodeIgniter\HTTP\Files\UploadedFile    $file       Arquivo recebido via multipart
     * @return array{success: bool, data?: array, message?: string, code?: int}
     */
    public function uploadAvatar(int $customerId, \CodeIgniter\HTTP\Files\UploadedFile $file, int $userSaasTenantId): array
    {
        if (!$this->tableModel->find($customerId)) {
            return ['success' => false, 'message' => 'Cliente não encontrado', 'code' => 404];
        }

        $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!in_array($file->getMimeType(), $allowedMimes, true)) {
            return ['success' => false, 'message' => 'Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.', 'code' => 422];
        }

        if ($file->getSize() > 5 * 1024 * 1024) {
            return ['success' => false, 'message' => 'Arquivo muito grande. Máximo 5MB.', 'code' => 422];
        }

        $uuid       = bin2hex(random_bytes(16));
        $ext        = $file->getClientExtension() ?: 'jpg';
        $filename   = $uuid . '.' . $ext;
        $uploadPath = WRITEPATH . 'uploads/avatars/';

        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }

        if (!$file->move($uploadPath, $filename)) {
            return ['success' => false, 'message' => 'Erro ao salvar o arquivo', 'code' => 500];
        }

        $storedPath = 'uploads/avatars/' . $filename;
        $checksum   = hash('sha256', file_get_contents($uploadPath . $filename));
        $now        = date('Y-m-d H:i:s');

        db_connect('banco1')->table('user_003_customer_files')->insert([
            'user_saas_tenants_id' => $userSaasTenantId,
            'user_customer_id'     => $customerId,
            'original_name'        => $file->getClientFilename(),
            'filename'             => $filename,
            'stored_path'          => $storedPath,
            'uuid'                 => $uuid,
            'mime'                 => $file->getMimeType(),
            'size'                 => $file->getSize(),
            'category'             => 'avatar',
            'checksum'             => $checksum,
            'created_at'           => $now,
            'updated_at'           => $now,
        ]);

        $this->tableModel->update($customerId, ['profile' => $storedPath]);

        return [
            'success' => true,
            'data'    => [
                'customer_id' => $customerId,
                'stored_path' => $storedPath,
                'uuid'        => $uuid,
            ],
        ];
    }
}
