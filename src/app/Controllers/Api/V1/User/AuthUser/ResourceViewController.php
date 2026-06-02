<?php

namespace App\Controllers\Api\V1\User\AuthUser;

use App\Controllers\Api\V1\BaseResourceViewController;
use App\Requests\V1\User\AuthUser\LoginRequest;
use App\Requests\V1\User\AuthUser\RecoverPasswordRequest;
use App\Requests\V1\User\AuthUser\RefreshRequest;
use App\Requests\V1\User\AuthUser\ResetPasswordRequest;
use App\Services\V1\User\AuthUser\Processor;
use App\Services\V1\User\AuthUser\RefreshProcessor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

/**
 * Controller de recurso para o módulo AuthUser.
 *
 * Expõe os endpoints de autenticação e as consultas somente leitura
 * da view view_auth_user.
 *
 * Fluxo de reset de senha:
 *   POST /recover-password        → solicita reset, envia e-mail com token
 *   GET  /reset-password/{token}  → valida o token (use antes de exibir o form)
 *   POST /reset-password          → aplica a nova senha e invalida o token
 *
 * Nenhuma lógica de negócio aqui — apenas:
 *   1. Valida a requisição (Request)
 *   2. Chama o Processor (Service)
 *   3. Retorna a resposta padronizada
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

    // -------------------------------------------------------------------------
    // Autenticação
    // -------------------------------------------------------------------------

    /**
     * POST {{www}}/index.php/api/v1/auth/login
     *
     * Body: { "um_user": "...", "um_password": "...", "ut_user_saas_tenants_id": 1 }
     *
     * Autentica o usuário e retorna um token JWT.
     */
    public function login(): ResponseInterface
    {
        try {
            $loginRequest = new LoginRequest();
            $validation = \Config\Services::validation();
            $validation->setRules($loginRequest->rules(), $loginRequest->messages());

            $body = $this->getJsonBody();

            if (!$validation->run($body)) {
                return $this->respondValidationError($validation->getErrors());
            }

            $result = $this->processor->authenticate(
                (string) ($body['um_user'] ?? ''),
                (string) ($body['um_password'] ?? ''),
                (int) ($body['ut_user_saas_tenants_id'] ?? 0)
            );

            return $this->respondSuccess($result, 'Autenticacao realizada com sucesso');
        } catch (\InvalidArgumentException $e) {
            return $this->respondError($e->getMessage(), 401);
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        }
    }

    /**
     * POST {{www}}/index.php/api/v1/auth/recover-password
     *
     * Body: { "uc_mail": "usuario@email.com" }
     *
     * Verifica se o e-mail existe, gera token seguro, persiste em
     * user_006_password_resets e envia o e-mail com o link de reset.
     */
    public function recoverPassword(): ResponseInterface
    {
        try {
            $recoverRequest = new RecoverPasswordRequest();
            $validation = \Config\Services::validation();
            $validation->setRules($recoverRequest->rules(), $recoverRequest->messages());

            $body = $this->getJsonBody();

            if (!$validation->run($body)) {
                return $this->respondValidationError($validation->getErrors());
            }

            $result = $this->processor->sendRecoveryEmail(
                (string) ($body['uc_mail'] ?? '')
            );

            return $this->respondSuccess($result, 'E-mail de recuperação enviado com sucesso');
        } catch (\InvalidArgumentException $e) {
            return $this->respondError($e->getMessage(), 404);
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        }
    }

    /**
     * GET {{www}}/index.php/api/v1/auth/reset-password/{token}
     *
     * Valida se o token de reset está ativo (não expirado, não utilizado).
     * Use este endpoint antes de exibir o formulário de nova senha.
     *
     * Retorna: { id, user_id, expires_at }
     */
    public function validateResetToken(string $token): ResponseInterface
    {
        try {
            $result = $this->processor->validateResetToken($token);

            return $this->respondSuccess($result, 'Token válido');
        } catch (\InvalidArgumentException $e) {
            return $this->respondError($e->getMessage(), 422);
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        }
    }

    /**
     * POST {{www}}/index.php/api/v1/auth/reset-password
     *
     * Body: { "token": "<64 hex chars>", "password": "...", "password_confirm": "..." }
     *
     * Valida o token, aplica a nova senha com bcrypt e marca o token como utilizado.
     * O token é invalidado após o uso — não pode ser reutilizado.
     */
    public function resetPassword(): ResponseInterface
    {
        try {
            $resetRequest = new ResetPasswordRequest();
            $validation = \Config\Services::validation();
            $validation->setRules($resetRequest->rules(), $resetRequest->messages());

            $body = $this->getJsonBody();

            if (!$validation->run($body)) {
                return $this->respondValidationError($validation->getErrors());
            }

            $result = $this->processor->applyPasswordReset(
                (string) ($body['token'] ?? ''),
                (string) ($body['password'] ?? '')
            );

            return $this->respondSuccess($result, 'Senha redefinida com sucesso');
        } catch (\InvalidArgumentException $e) {
            return $this->respondError($e->getMessage(), 422);
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        }
    }

    /**
     * POST {{www}}/index.php/api/v1/auth/refresh
     *
     * Body: { "refresh_token": "<64 hex chars>" }
     *
     * Valida e revoga o refresh token atual; emite novo access token e novo refresh token (rotação).
     * Rota pública — excluída do authFilter pois o access token pode estar expirado.
     */
    public function refresh(): ResponseInterface
    {
        try {
            $refreshRequest = new RefreshRequest();
            $validation     = \Config\Services::validation();
            $validation->setRules($refreshRequest->rules(), $refreshRequest->messages());

            $body = $this->getJsonBody();

            if (!$validation->run($body)) {
                return $this->respondValidationError($validation->getErrors());
            }

            $result = (new RefreshProcessor())->refresh((string) ($body['refresh_token'] ?? ''));

            return $this->respondSuccess($result, 'Token renovado com sucesso');
        } catch (\InvalidArgumentException $e) {
            return $this->respondError($e->getMessage(), 401);
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        }
    }

    /**
     * POST {{www}}/index.php/api/v1/auth/logout
     *
     * Valida o token Bearer e encerra a sessão do usuário.
     * O token é extraído do header Authorization e repassado ao Processor.
     */
    public function logout(): ResponseInterface
    {
        try {
            $authHeader = $this->request->getHeaderLine('Authorization');
            $token = substr($authHeader, 7); // Remove "Bearer "

            $result = $this->processor->logout($token);

            return $this->respondSuccess($result, 'Logout realizado com sucesso');
        } catch (\InvalidArgumentException $e) {
            return $this->respondError($e->getMessage(), 401);
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        }
    }
}
