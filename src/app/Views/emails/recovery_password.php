<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <title>Recuperação de Senha</title>
</head>

<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 30px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0"
                    style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                    <!-- Cabeçalho -->
                    <tr>
                        <td style="background-color: #2c3e50; padding: 24px 32px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Sistema Habilidade</h1>
                        </td>
                    </tr>

                    <!-- Corpo -->
                    <tr>
                        <td style="padding: 32px;">
                            <h2 style="color: #2c3e50; margin-top: 0;">Recuperação de Senha</h2>

                            <p style="color: #555555; font-size: 15px;">
                                Olá, <strong><?= esc($name) ?></strong>!
                            </p>

                            <p style="color: #555555; font-size: 15px;">
                                Recebemos uma solicitação de recuperação de senha para o e-mail
                                <strong><?= esc($mail) ?></strong>.
                            </p>

                            <p style="color: #555555; font-size: 15px;">
                                Clique no botão abaixo para redefinir sua senha. O link é válido por
                                <strong>1 hora</strong> e expira em <strong><?= esc($expiresAt) ?></strong>.
                            </p>

                            <table cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                                <tr>
                                    <td style="background-color: #2c3e50; border-radius: 4px; padding: 12px 24px;">
                                        <a href="<?= base_url('/web/v1/auth/recover-password/' . esc($token)) ?>"
                                            style="color: #ffffff; text-decoration: none; font-size: 15px; font-weight: bold;">
                                            Redefinir Senha
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #777777; font-size: 13px; word-break: break-all;">
                                Se o botão não funcionar, copie e cole o link abaixo no navegador:<br>
                                <span style="color: #2c3e50;"><?= base_url('/web/v1/auth/recover-password/' . esc($token)) ?></span>
                            </p>

                            <p style="color: #999999; font-size: 13px;">
                                Se você não solicitou a recuperação de senha, ignore este e-mail.
                                Sua senha permanece inalterada.
                            </p>
                        </td>
                    </tr>

                    <!-- Rodapé -->
                    <tr>
                        <td style="background-color: #f9f9f9; padding: 16px 32px; border-top: 1px solid #eeeeee;">
                            <p style="color: #aaaaaa; font-size: 12px; margin: 0;">
                                Sistema Habilidade &mdash; E-mail gerado automaticamente, não responda.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>

</html>
