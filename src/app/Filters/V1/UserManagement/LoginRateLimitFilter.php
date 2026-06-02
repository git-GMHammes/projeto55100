<?php

namespace App\Filters\V1\UserManagement;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Filtro de rate limiting para o endpoint de login.
 * Limita a 10 tentativas por minuto por endereço IP.
 * Retorna HTTP 429 com Retry-After em caso de bloqueio.
 */
class LoginRateLimitFilter implements FilterInterface
{
    private const MAX_ATTEMPTS    = 10;
    private const WINDOW_SECONDS  = 60;

    public function before(RequestInterface $request, $arguments = null)
    {
        $ip       = $request->getIPAddress();
        $cacheKey = 'login_attempts_' . md5($ip);

        $throttler = \Config\Services::throttler();

        if (!$throttler->check($cacheKey, self::MAX_ATTEMPTS, self::WINDOW_SECONDS)) {
            $retryAfter = max(1, (int) (self::WINDOW_SECONDS - $throttler->getTokenTime()));

            return service('response')
                ->setStatusCode(429)
                ->setHeader('Retry-After', (string) $retryAfter)
                ->setContentType('application/json')
                ->setBody(json_encode([
                    'statusCode'  => 429,
                    'message'     => 'Muitas tentativas de login. Aguarde ' . $retryAfter . ' segundos.',
                    'success'     => false,
                    'data'        => null,
                    'retry_after' => $retryAfter,
                ]));
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }
}
