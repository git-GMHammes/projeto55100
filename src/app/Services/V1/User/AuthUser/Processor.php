<?php

namespace App\Services\V1\User\AuthUser;

use App\Libraries\JwtHelper;
use App\Models\V1\User\AuthUser\SqlViewModel;
use App\Models\V1\User\UserManagement\SqlTableModel as UserManagementModel;
use App\Models\V1\User\UserPasswordResets\SqlTableModel as PasswordResetsModel;
use App\Models\V1\User\UserRefreshTokens\SqlTableModel as RefreshTokensModel;
use App\Services\V1\BaseViewService;

/**
 * Service de autenticação do módulo AuthUser.
 *
 * Contém todas as regras de negócio de autenticação:
 *   - Consulta do usuário via Model
 *   - Verificação de senha com password_verify
 *   - Geração e revogação de token JWT
 *   - Fluxo completo de reset de senha (emissão, validação e aplicação)
 *
 * Nunca acessa Request nem Response diretamente.
 */
class Processor extends BaseViewService
{
    /** Tempo de vida do token JWT em segundos (10 horas). */
    private const JWT_TTL = 36000;

    /** Tempo de vida do token de reset de senha em segundos (1 hora). */
    private const RESET_TOKEN_TTL = 3600;

    /** Tempo de vida do refresh token em segundos (7 dias). */
    private const REFRESH_TOKEN_TTL = 604800;

    /** View do template de e-mail de recuperação de senha. */
    private const EMAIL_VIEW_RECOVERY = 'emails/recovery_password';

    protected SqlViewModel        $viewModel;
    protected UserManagementModel  $userModel;
    protected PasswordResetsModel  $resetModel;
    protected RefreshTokensModel   $refreshModel;

    public function __construct()
    {
        $this->viewModel    = new SqlViewModel();
        $this->userModel    = new UserManagementModel();
        $this->resetModel   = new PasswordResetsModel();
        $this->refreshModel = new RefreshTokensModel();
    }

    // -------------------------------------------------------------------------
    // Autenticação
    // -------------------------------------------------------------------------

    /**
     * Autentica o usuário pelo campo user, password e tenant.
     *
     * Fluxo:
     *   1. Sanitizar entrada
     *   2. Buscar usuário ativo com vínculo ao tenant informado
     *   3. Verificar senha com password_verify
     *   4. Gerar token JWT com payload (sub, cpf, iat, exp)
     *   5. Retornar token e dados do usuário (sem senha)
     *
     * @param  string $user     Identificador do usuário (campo um_user)
     * @param  string $password Senha em texto plano para verificação
     * @param  int    $tenantId ID do tenant (campo ut_tenant_id)
     * @return array            Dados de autenticação (token, token_type, expires_in, user)
     *
     * @throws \InvalidArgumentException Se usuário não encontrado, sem vínculo ao tenant ou senha inválida
     */
    public function authenticate(string $user, string $password, int $tenantId): array
    {
        $user   = $this->sanitizeString($user);
        $record = $this->viewModel->findByUserAndTenant($user, $tenantId);

        if ($record === null || !password_verify($password, $record['um_password'])) {
            throw new \InvalidArgumentException('Credenciais inválidas');
        }

        $payload = [
            'sub' => $record['uc_user_id'],
            'cpf' => $record['uc_cpf'],
        ];

        $token    = JwtHelper::encode($payload, self::JWT_TTL);
        $userData = $record;
        unset($userData['um_password']);

        $refreshTokenPlain = bin2hex(random_bytes(32));
        $refreshTokenHash  = hash('sha256', $refreshTokenPlain);
        $refreshExpiresAt  = date('Y-m-d H:i:s', time() + self::REFRESH_TOKEN_TTL);

        $this->refreshModel->insert([
            'user_management_id'   => (int) ($record['uc_user_id'] ?? 0),
            'user_saas_tenants_id' => $tenantId,
            'token_hash'           => $refreshTokenHash,
            'expires_at'           => $refreshExpiresAt,
            'ip_address'           => substr(service('request')->getIPAddress(), 0, 45),
            'user_agent'           => substr((string) service('request')->getUserAgent()->getAgentString(), 0, 255),
        ]);

        return [
            'token'              => $token,
            'token_type'         => 'Bearer',
            'expires_in'         => self::JWT_TTL,
            'refresh_token'      => $refreshTokenPlain,
            'refresh_expires_in' => self::REFRESH_TOKEN_TTL,
            'user'               => $userData,
        ];
    }

    // -------------------------------------------------------------------------
    // Recuperação de senha — Passo 1: solicitar reset
    // -------------------------------------------------------------------------

    /**
     * Verifica se o e-mail existe, gera token seguro, persiste e envia e-mail.
     *
     * Fluxo:
     *   1. Buscar usuário ativo pelo campo uc_mail na view
     *   2. Invalidar tokens pendentes anteriores (evitar tokens órfãos)
     *   3. Gerar token criptograficamente seguro (plain) + hash SHA-256
     *   4. Persistir na tabela user_006_password_resets
     *   5. Renderizar template HTML com o token plain no link
     *   6. Enviar via SMTP
     *
     * @param  string $mail E-mail informado pelo usuário (campo uc_mail)
     * @return array        Confirmação do envio com dados do destinatário e expiração
     *
     * @throws \InvalidArgumentException Se o e-mail não existir na base
     * @throws \RuntimeException         Se falhar ao persistir ou enviar
     */
    public function sendRecoveryEmail(string $mail): array
    {
        $mail   = $this->sanitizeString($mail);
        $record = $this->viewModel->findByMail($mail);

        if ($record === null) {
            throw new \InvalidArgumentException('E-mail não encontrado');
        }

        $userId = (int) ($record['uc_user_id'] ?? 0);
        $name   = $record['uc_name'] ?? 'Usuário';

        $this->resetModel->softDeleteActiveByUserId($userId);

        $token     = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $token);
        $expiresAt = date('Y-m-d H:i:s', time() + self::RESET_TOKEN_TTL);

        $resetId = $this->resetModel->insert([
            'user_management_id' => $userId,
            'token_hash' => $tokenHash,
            'expires_at' => $expiresAt,
            'ip_address' => substr(service('request')->getIPAddress(), 0, 45),
            'user_agent' => substr((string) service('request')->getUserAgent()->getAgentString(), 0, 255),
        ]);

        if (!$resetId) {
            throw new \RuntimeException('Falha ao registrar a solicitação de recuperação de senha.');
        }

        $body = view(self::EMAIL_VIEW_RECOVERY, [
            'name'      => $name,
            'mail'      => $mail,
            'token'     => $token,
            'expiresAt' => $expiresAt,
        ]);

        $this->dispatchEmail($mail, $name, 'Recuperação de Senha - Sistema Habilidade', $body);

        return [
            'uc_mail'    => $mail,
            'uc_name'    => $name,
            'expires_at' => $expiresAt,
        ];
    }

    // -------------------------------------------------------------------------
    // Recuperação de senha — Passo 2: validar token
    // -------------------------------------------------------------------------

    /**
     * Valida se o token de reset é ativo: não utilizado, não expirado e não excluído.
     *
     * @param  string $token Token plain de 64 chars recebido pelo usuário via link do e-mail
     * @return array         Dados do registro de reset (id, user_id, expires_at)
     *
     * @throws \InvalidArgumentException Se o token for inválido, expirado ou já utilizado
     */
    public function validateResetToken(string $token): array
    {
        $token  = $this->sanitizeString($token);
        $record = $this->resetModel->findActiveByTokenHash(hash('sha256', $token));

        if ($record === null) {
            throw new \InvalidArgumentException('Token inválido, expirado ou já utilizado');
        }

        return [
            'id'                 => (int) $record['id'],
            'user_management_id' => (int) $record['user_management_id'],
            'expires_at'         => $record['expires_at'],
        ];
    }

    // -------------------------------------------------------------------------
    // Recuperação de senha — Passo 3: aplicar nova senha
    // -------------------------------------------------------------------------

    /**
     * Valida o token, aplica o hash bcrypt na nova senha e marca o token como usado.
     *
     * @param  string $token    Token plain de 64 chars recebido no body da requisição
     * @param  string $password Nova senha em texto plano
     * @return array            ID do usuário que teve a senha redefinida
     *
     * @throws \InvalidArgumentException Se token inválido ou usuário não encontrado
     * @throws \RuntimeException         Se a atualização falhar
     */
    public function applyPasswordReset(string $token, string $password): array
    {
        $token  = $this->sanitizeString($token);
        $record = $this->resetModel->findActiveByTokenHash(hash('sha256', $token));

        if ($record === null) {
            throw new \InvalidArgumentException('Token inválido, expirado ou já utilizado');
        }

        $userId  = (int) $record['user_management_id'];
        $resetId = (int) $record['id'];

        if ($this->userModel->find($userId) === null) {
            throw new \InvalidArgumentException('Usuário vinculado ao token não encontrado');
        }

        $this->userModel->update($userId, [
            'password' => password_hash($password, PASSWORD_BCRYPT),
        ]);

        $this->resetModel->markAsUsed($resetId);

        return [
            'user_management_id' => $userId,
        ];
    }

    // -------------------------------------------------------------------------
    // Logout
    // -------------------------------------------------------------------------

    /**
     * Valida o token JWT e o revoga no cache pelo tempo restante de expiração.
     *
     * @param  string $token Token JWT recebido no header Authorization
     * @return array         Dados de identificação (user_id)
     *
     * @throws \InvalidArgumentException Se o token for inválido ou expirado
     */
    public function logout(string $token): array
    {
        try {
            $payload = JwtHelper::decode($token);
        } catch (\RuntimeException $e) {
            throw new \InvalidArgumentException($e->getMessage());
        }

        $ttl = max(0, ($payload['exp'] ?? 0) - time());

        if ($ttl > 0) {
            cache()->save('jwt_revoked_' . hash('sha256', $token), true, $ttl);
        }

        $userId = $payload['sub'] ?? null;
        if ($userId !== null) {
            $this->refreshModel->revokeByUserId((int) $userId);
        }

        return ['user_management_id' => $userId];
    }

    // -------------------------------------------------------------------------
    // Auxiliares privados
    // -------------------------------------------------------------------------

    /**
     * Configura e envia o e-mail via SMTP usando o remetente de recuperação.
     *
     * @throws \RuntimeException Se o envio falhar
     */
    private function dispatchEmail(string $to, string $name, string $subject, string $body): void
    {
        $recovery = config('Email')->recoveryEmail;

        $email = \Config\Services::email();
        $email->initialize([
            'SMTPUser' => $recovery['SMTPUser'],
            'SMTPPass' => $recovery['SMTPPass'],
        ]);
        $email->setFrom($recovery['email'], $recovery['name']);
        $email->setTo($to);
        $email->setSubject($subject);
        $email->setMessage($body);

        if (!$email->send()) {
            log_message('error', "[AuthUser::sendRecoveryEmail] Falha ao enviar para {$to}: " . $email->printDebugger(['headers']));

            throw new \RuntimeException('Falha ao enviar o e-mail de recuperação.');
        }
    }
}
