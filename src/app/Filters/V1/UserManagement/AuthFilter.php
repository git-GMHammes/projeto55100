<?php

namespace App\Filters\V1\UserManagement;

use App\Libraries\JwtHelper;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Filtro global de autenticação JWT.
 *
 * Intercepta todas as requisições HTTP e valida o token Bearer
 * informado no header Authorization. Rotas públicas configuradas
 * como exceção no Config/Filters.php são ignoradas automaticamente
 * pelo CI4 antes de o filtro ser executado.
 *
 * Rotas públicas (except):
 *   POST /api/v1/auth/login
 *   POST /api/v1/user-management/create
 *   POST /api/v1/user-customer/create
 *   POST /api/v1/user-customer_files/create
 */
class AuthFilter implements FilterInterface
{
    /**
     * Executa antes do controller.
     *
     * Valida o token JWT presente no header Authorization.
     * Retorna resposta 401 caso o token esteja ausente, inválido ou expirado.
     *
     * @param RequestInterface $request
     * @param array|null       $arguments Argumentos opcionais passados pelo CI4
     * @return RequestInterface|ResponseInterface|string|void
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        log_message('debug', '[AuthFilter] called. URI=' . service('uri')->getPath() . ' | REQUEST_URI=' . ($_SERVER['REQUEST_URI'] ?? 'n/a'));

        $authHeader = $request->getHeaderLine('Authorization');

        // Verificar presença do header Authorization com Bearer
        if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
            return $this->respondUnauthorized('Token de autenticação não informado');
        }

        $token = substr($authHeader, 7); // Remove "Bearer "

        try {
            // Decodificar e validar o token JWT (assinatura + expiração)
            JwtHelper::decode($token);
        } catch (\RuntimeException $e) {
            return $this->respondUnauthorized($e->getMessage());
        }

        // Verificar se o token foi revogado via logout
        if (cache()->get('jwt_revoked_' . hash('sha256', $token)) !== null) {
            return $this->respondUnauthorized('Token revogado. Faça login novamente.');
        }
    }

    /**
     * Executa após o controller — nenhuma ação necessária aqui.
     *
     * @param RequestInterface  $request
     * @param ResponseInterface $response
     * @param array|null        $arguments
     * @return ResponseInterface|void
     */
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Sem processamento pós-resposta
    }

    // -------------------------------------------------------------------------
    // Utilitário interno
    // -------------------------------------------------------------------------

    /**
     * Monta e retorna resposta JSON 401 Não Autorizado.
     */
    private function respondUnauthorized(string $message): ResponseInterface
    {
        $response = service('response');

        return $response
            ->setStatusCode(401)
            ->setContentType('application/json')
            ->setBody(json_encode([
                'statusCode' => 401,
                'message'    => $message,
                'success'    => false,
                'data'       => null,
            ]));
    }
}
