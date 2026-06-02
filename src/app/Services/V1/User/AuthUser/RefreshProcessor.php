<?php

namespace App\Services\V1\User\AuthUser;

use App\Libraries\JwtHelper;
use App\Models\V1\User\AuthUser\SqlViewModel;
use App\Models\V1\User\UserRefreshTokens\SqlTableModel as RefreshTokensModel;
use App\Services\V1\BaseViewService;

/**
 * Responsável exclusivamente pelo fluxo de renovação de access token via refresh token.
 * Separado do Processor principal para manter responsabilidade única (SRP).
 */
class RefreshProcessor extends BaseViewService
{
    private const JWT_TTL           = 36000;
    private const REFRESH_TOKEN_TTL = 604800;

    protected RefreshTokensModel $refreshModel;
    protected SqlViewModel       $viewModel;

    public function __construct()
    {
        $this->refreshModel = new RefreshTokensModel();
        $this->viewModel    = new SqlViewModel();
    }

    /**
     * Valida o refresh token, revoga-o (rotação), emite novo access token e novo refresh token.
     *
     * @throws \InvalidArgumentException Se o refresh token for inválido, expirado ou já utilizado
     */
    public function refresh(string $refreshToken): array
    {
        $refreshToken = $this->sanitizeString($refreshToken);
        $record       = $this->refreshModel->findActiveByTokenHash(hash('sha256', $refreshToken));

        if ($record === null) {
            throw new \InvalidArgumentException('Refresh token inválido, expirado ou já utilizado');
        }

        $userId   = (int) $record['user_management_id'];
        $tenantId = (int) $record['user_saas_tenants_id'];

        $this->refreshModel->markAsUsed((int) $record['id']);

        $userRecord = $this->viewModel->findByIdAndTenant($userId, $tenantId);
        if ($userRecord === null) {
            throw new \InvalidArgumentException('Usuário vinculado ao refresh token não encontrado ou inativo');
        }

        $payload  = ['sub' => $userId, 'cpf' => $userRecord['uc_cpf'] ?? ''];
        $newToken = JwtHelper::encode($payload, self::JWT_TTL);

        $newRefreshPlain = bin2hex(random_bytes(32));
        $newRefreshHash  = hash('sha256', $newRefreshPlain);
        $newExpiresAt    = date('Y-m-d H:i:s', time() + self::REFRESH_TOKEN_TTL);

        $this->refreshModel->insert([
            'user_management_id'   => $userId,
            'user_saas_tenants_id' => $tenantId,
            'token_hash'           => $newRefreshHash,
            'expires_at'           => $newExpiresAt,
            'ip_address'           => substr(service('request')->getIPAddress(), 0, 45),
            'user_agent'           => substr((string) service('request')->getUserAgent()->getAgentString(), 0, 255),
        ]);

        return [
            'token'              => $newToken,
            'token_type'         => 'Bearer',
            'expires_in'         => self::JWT_TTL,
            'refresh_token'      => $newRefreshPlain,
            'refresh_expires_in' => self::REFRESH_TOKEN_TTL,
        ];
    }
}
