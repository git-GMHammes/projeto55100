<?php

namespace App\Libraries;

use App\Models\V1\User\UserCustomerFiles\SqlTableModel as FileModel;
use CodeIgniter\HTTP\Files\UploadedFile;

/**
 * Library transversal de upload de arquivos.
 *
 * Recebe userId, moduleSlug, files[] e um objeto de constraints, e resolve
 * todo o ciclo: validação → gravação em disco → registro em user_003_customer_files.
 *
 * Como usar em qualquer controller:
 *   $lib    = new FileUploadLibrary();
 *   $result = $lib->upload($userCustomerId, $constraints->moduleSlug(), [$file], $constraints, $tenantId);
 *
 * O objeto $constraints deve expor:
 *   allowedMimes(): array   — vazio = aceita qualquer tipo
 *   maxSizeMb(): int
 *   category(): string
 */
class FileUploadLibrary
{
    private FileModel $fileModel;

    private const BASE_UPLOAD_DIR = 'uploads/Projeto56300App/user_customer_files/';

    public function __construct()
    {
        $this->fileModel = new FileModel();
    }

    /**
     * @param int            $userCustomerId   ID do registro em user_002_customer
     * @param string         $moduleSlug       Slug do módulo/endpoint (ex: 'user-customer-file')
     * @param UploadedFile[] $files            Array de arquivos multipart
     * @param object         $constraints      Objeto com allowedMimes(), maxSizeMb(), category()
     * @param int            $userSaasTenantId ID do tenant para isolamento multi-tenant
     * @return array{success: bool, results: array, total: int, success_count: int, error_count: int}
     *              ou array{success: bool, message: string, code: int} em caso de erro fatal
     */
    public function upload(
        int    $userCustomerId,
        string $moduleSlug,
        array  $files,
        object $constraints,
        int    $userSaasTenantId
    ): array {
        if (!$this->fileModel->existsUserCustomer($userCustomerId)) {
            return ['success' => false, 'message' => 'Cliente não encontrado', 'code' => 404];
        }

        $userFolder  = \sprintf('usu_%019d', $userCustomerId);
        $uploadDir   = self::BASE_UPLOAD_DIR . $userFolder . '/' . $moduleSlug . '/';
        $uploadPath  = WRITEPATH . $uploadDir;

        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }

        $allowedMimes = $constraints->allowedMimes();
        $maxBytes     = $constraints->maxSizeMb() * 1024 * 1024;
        $category     = $constraints->category();

        $results      = [];
        $successCount = 0;
        $errorCount   = 0;

        foreach ($files as $index => $file) {
            if (!($file instanceof UploadedFile) || !$file->isValid()) {
                $results[] = ['index' => $index, 'success' => false, 'message' => 'Arquivo inválido ou não enviado'];
                $errorCount++;
                continue;
            }

            if ($file->getSize() > $maxBytes) {
                $results[] = [
                    'index'         => $index,
                    'success'       => false,
                    'message'       => "Arquivo muito grande. Máximo {$constraints->maxSizeMb()}MB.",
                    'original_name' => $file->getName(),
                ];
                $errorCount++;
                continue;
            }

            if (!empty($allowedMimes) && !\in_array($file->getMimeType(), $allowedMimes, true)) {
                $results[] = [
                    'index'         => $index,
                    'success'       => false,
                    'message'       => 'Tipo de arquivo não permitido: ' . $file->getMimeType(),
                    'original_name' => $file->getName(),
                ];
                $errorCount++;
                continue;
            }

            $originalName = $file->getName();
            $mime         = $file->getMimeType();
            $size         = $file->getSize();
            $uuid         = \bin2hex(\random_bytes(16));
            $ext          = \strtolower($file->getClientExtension() ?: 'bin');
            $filename     = 'file_upload_' . $uuid . '.' . $ext;

            if (!$file->move($uploadPath, $filename)) {
                $results[] = [
                    'index'         => $index,
                    'success'       => false,
                    'message'       => 'Erro ao salvar o arquivo no servidor',
                    'original_name' => $originalName,
                ];
                $errorCount++;
                continue;
            }

            $storedPath = $uploadDir . $filename;
            $checksum   = \hash('sha256', \file_get_contents(WRITEPATH . $storedPath));
            $now        = \date('Y-m-d H:i:s');

            try {
                $id = $this->fileModel->insert([
                    'user_saas_tenants_id' => $userSaasTenantId,
                    'user_customer_id'     => $userCustomerId,
                    'original_name'        => $originalName,
                    'filename'             => $filename,
                    'stored_path'          => $storedPath,
                    'uuid'                 => $uuid,
                    'mime'                 => $mime,
                    'size'                 => $size,
                    'category'             => $category,
                    'checksum'             => $checksum,
                    'created_at'           => $now,
                    'updated_at'           => $now,
                ]);

                if (!$id) {
                    $results[] = [
                        'index'         => $index,
                        'success'       => false,
                        'message'       => 'Erro ao registrar no banco de dados',
                        'original_name' => $originalName,
                    ];
                    $errorCount++;
                    continue;
                }

                $results[] = [
                    'index'   => $index,
                    'success' => true,
                    'data'    => [
                        'id'                   => $id,
                        'user_customer_id'     => $userCustomerId,
                        'user_saas_tenants_id' => $userSaasTenantId,
                        'module_slug'          => $moduleSlug,
                        'original_name'        => $originalName,
                        'filename'             => $filename,
                        'stored_path'          => $storedPath,
                        'uuid'                 => $uuid,
                        'mime'                 => $mime,
                        'size'                 => $size,
                        'category'             => $category,
                        'checksum'             => $checksum,
                    ],
                ];
                $successCount++;
            } catch (\Throwable $e) {
                log_message('error', '[FileUploadLibrary::upload] ' . $e->getMessage());
                $results[] = [
                    'index'         => $index,
                    'success'       => false,
                    'message'       => 'Erro interno ao registrar o arquivo',
                    'original_name' => $originalName,
                ];
                $errorCount++;
            }
        }

        return [
            'success'       => $successCount > 0,
            'results'       => $results,
            'total'         => \count($files),
            'success_count' => $successCount,
            'error_count'   => $errorCount,
        ];
    }
}
