import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormGrid, { FormGridSchema } from '../../../../../components/ui/FormGrid/Input'
import notDefinedImg from '../../../../../assets/images/not_defined.png'
import { getActiveTheme } from '../../../../../themes/global'
import { ENVIRONMENT } from '../../../../../config/constants'
import * as AuthService from '../../../../../services/modules/V1/authService'
import { saveSession } from '../../../../../services/modules/V1/authService/session'

// ─── Schema do formulário ─────────────────────────────────────────────────────

const schema: FormGridSchema = {
    rows: [
        {
            fields: [
                {
                    col: 12,
                    label: 'Usuário',
                    id: 'um_user',
                    name: 'um_user',
                    placeholder: 'Digite seu usuário',
                    required: true,
                    autoComplete: 'username',
                },
                {
                    type: 'password',
                    col: 12,
                    label: 'Senha',
                    id: 'um_password',
                    name: 'um_password',
                    placeholder: 'Digite sua senha',
                    required: true,
                    autoComplete: 'current-password',
                },
                {
                    col: 12,
                    id: 'ut_user_saas_tenants_id',
                    name: 'ut_user_saas_tenants_id',
                    defaultValue: '1',
                    hidden: true,
                },
            ],
        },
    ],
}

// ─── Componente ───────────────────────────────────────────────────────────────

function LoginModelo001() {
    const navigate = useNavigate()
    const { login: theme } = getActiveTheme()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [debugData, setDebugData] = useState<unknown>(null)

    const isDev = ENVIRONMENT === 'development'

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const form = e.currentTarget
        const data = new FormData(form)

        const payload: AuthService.LoginPayload = {
            um_user: btoa(String(data.get('um_user') ?? '')),
            um_password: btoa(String(data.get('um_password') ?? '')),
            ut_user_saas_tenants_id: String(data.get('ut_user_saas_tenants_id') ?? '1'),
        }

        try {
            const response = await AuthService.login(payload)

            if (isDev) setDebugData(response)

            if (response.success && response.data) {
                saveSession(
                    response.data.token,
                    response.data.token_type,
                    response.data.expires_in,
                    response.data.user,
                )
                navigate('/v1/home')
            } else {
                setError(response.message ?? 'Erro ao realizar login')
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Erro de conexão com o servidor'
            setError(msg)
            if (isDev) setDebugData({ error: msg })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${theme.bgStart} 0%, ${theme.bgMid} 55%, ${theme.bgEnd} 100%)`,
                    padding: '1.5rem',
                }}
            >
                <div
                    className="card shadow-lg border-0"
                    style={{
                        width: '100%',
                        maxWidth: 420,
                        borderRadius: '1rem',
                        backgroundColor: theme.cardBg,
                        overflow: 'hidden',
                    }}
                >
                    {/* ── Cabeçalho colorido ── */}
                    <div
                        style={{
                            background: `linear-gradient(135deg, ${theme.headerStart} 0%, ${theme.headerEnd} 100%)`,
                            padding: '2rem 2rem 1.5rem',
                            textAlign: 'center',
                        }}
                    >
                        <img
                            src={notDefinedImg}
                            alt="Logo"
                            style={{
                                maxHeight: 72,
                                maxWidth: '100%',
                                objectFit: 'contain',
                                marginBottom: '0.75rem',
                            }}
                        />
                        <h5
                            className="mb-0 fw-semibold"
                            style={{ color: theme.headerText, letterSpacing: '0.03em' }}
                        >
                            Acesso ao Sistema
                        </h5>
                    </div>

                    {/* ── Corpo do card ── */}
                    <div className="card-body px-4 pt-4 pb-3">
                        {error && (
                            <div className="alert alert-danger py-2 mb-3" role="alert">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate>
                            <FormGrid schema={schema} />

                            <button
                                type="submit"
                                className="btn w-100 mt-2 fw-semibold"
                                disabled={loading}
                                style={{
                                    backgroundColor: theme.btnBg,
                                    borderColor: theme.btnBg,
                                    color: theme.btnText,
                                    borderRadius: '0.5rem',
                                    padding: '0.6rem',
                                    transition: 'background-color 0.2s',
                                }}
                                onMouseEnter={e =>
                                    ((e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.btnBgHover)
                                }
                                onMouseLeave={e =>
                                    ((e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.btnBg)
                                }
                            >
                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        Entrando…
                                    </>
                                ) : (
                                    'Entrar'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* ── Rodapé com links ── */}
                    <div
                        className="d-flex justify-content-between px-4 pb-4 pt-1"
                        style={{ fontSize: '0.85rem' }}
                    >
                        <Link
                            to="/v1/novo-registro"
                            style={{ color: theme.link, textDecoration: 'none' }}
                            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = theme.linkHover)}
                            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = theme.link)}
                        >
                            Novo Registro
                        </Link>

                        <Link
                            to="/v1/recuperar-senha"
                            style={{ color: theme.link, textDecoration: 'none' }}
                            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = theme.linkHover)}
                            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = theme.link)}
                        >
                            Recuperação de Senha
                        </Link>
                    </div>

                    {/* ── Botão DEBUG (apenas development, após primeira tentativa) ── */}
                    {isDev && debugData !== null && (
                        <div className="px-4 pb-4 text-center">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                data-bs-toggle="modal"
                                data-bs-target="#loginDebugModal"
                            >
                                DEBUG
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modal DEBUG Bootstrap (apenas development) ── */}
            {isDev && (
                <div
                    className="modal fade"
                    id="loginDebugModal"
                    tabIndex={-1}
                    aria-labelledby="loginDebugModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="loginDebugModalLabel">
                                    DEBUG — Resposta da API
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Fechar"
                                />
                            </div>
                            <div className="modal-body">
                                <pre
                                    className="mb-0"
                                    style={{
                                        fontSize: '0.8rem',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-all',
                                    }}
                                >
                                    {JSON.stringify(debugData, null, 2)}
                                </pre>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default LoginModelo001
