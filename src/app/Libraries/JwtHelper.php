<?php

namespace App\Libraries;

/**
 * Helper para geração e validação de tokens JWT (HS256).
 *
 * Implementação pura PHP — não depende de biblioteca externa.
 * Algoritmo: HMAC-SHA256 (HS256).
 *
 * O segredo deve ser definido na variável de ambiente JWT_SECRET
 * (arquivo .env na raiz do projeto).
 */
class JwtHelper
{
    /** Algoritmo declarado no header do JWT */
    private const ALGORITHM = 'HS256';

    /** Tempo de expiração padrão em segundos (10 horas) */
    private const DEFAULT_TTL = 36000;

    // -------------------------------------------------------------------------
    // Geração
    // -------------------------------------------------------------------------

    /**
     * Gera um token JWT assinado com HS256.
     *
     * @param array $payload Dados do usuário a incluir no token (sem iat/exp — adicionados aqui)
     * @param int   $ttl     Tempo de vida em segundos (padrão: 36000)
     * @return string Token JWT no formato header.payload.signature
     */
    public static function encode(array $payload, int $ttl = self::DEFAULT_TTL): string
    {
        $now = time();

        $payload['iat'] = $now;
        $payload['exp'] = $now + $ttl;

        $header  = self::base64UrlEncode(json_encode(['alg' => self::ALGORITHM, 'typ' => 'JWT']));
        $body    = self::base64UrlEncode(json_encode($payload));
        $signing = $header . '.' . $body;

        $signature = self::base64UrlEncode(
            hash_hmac('sha256', $signing, self::getSecret(), true)
        );

        return $signing . '.' . $signature;
    }

    // -------------------------------------------------------------------------
    // Validação
    // -------------------------------------------------------------------------

    /**
     * Decodifica e valida um token JWT.
     *
     * Verifica:
     *  - Estrutura (3 segmentos separados por ponto)
     *  - Assinatura HMAC-SHA256
     *  - Expiração (campo exp)
     *
     * @param  string $token Token JWT recebido no header Authorization
     * @return array         Payload decodificado
     * @throws \RuntimeException Se o token for inválido, adulterado ou expirado
     */
    public static function decode(string $token): array
    {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            throw new \RuntimeException('Token JWT malformado');
        }

        [$header, $body, $signature] = $parts;

        // Verificar assinatura
        $expectedSignature = self::base64UrlEncode(
            hash_hmac('sha256', $header . '.' . $body, self::getSecret(), true)
        );

        if (!hash_equals($expectedSignature, $signature)) {
            throw new \RuntimeException('Assinatura do token JWT inválida');
        }

        $payload = json_decode(self::base64UrlDecode($body), true);

        if (!is_array($payload)) {
            throw new \RuntimeException('Payload do token JWT inválido');
        }

        // Verificar expiração
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new \RuntimeException('Token JWT expirado');
        }

        return $payload;
    }

    // -------------------------------------------------------------------------
    // Utilitários internos
    // -------------------------------------------------------------------------

    /**
     * Codifica uma string em base64url (RFC 4648 §5) — sem padding.
     */
    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Decodifica uma string base64url (RFC 4648 §5).
     */
    private static function base64UrlDecode(string $data): string
    {
        $padded = str_pad(strtr($data, '-_', '+/'), strlen($data) + (4 - strlen($data) % 4) % 4, '=');
        return base64_decode($padded);
    }

    /**
     * Retorna o segredo JWT.
     * Prioridade: constante ofuscada definida em Puipuia.php → variável de ambiente.
     *
     * @throws \RuntimeException Se o segredo não estiver configurado
     */
    private static function getSecret(): string
    {
        // exit(E61E7DE603852182385DA5E907B4B232);
        $secret = defined('E61E7DE603852182385DA5E907B4B232')
            ? E61E7DE603852182385DA5E907B4B232
            : (getenv('JWT_SECRET') ?: '');

        if (empty($secret)) {
            throw new \RuntimeException('JWT_SECRET não configurado');
        }

        return $secret;
    }
}
