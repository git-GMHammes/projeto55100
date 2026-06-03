import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FormGrid, { FormGridSchema } from '../../../../components/ui/FormGrid/Input'
import notDefinedImg from '../../../../assets/images/not_defined.png'
import { getActiveTheme } from '../../../../themes/global'
import { ENVIRONMENT } from '../../../../config/constants'
import { createUserManagement, createUserCustomer } from '../../../../services/modules/V1/userService'

// ─── Schema da Etapa 2 — Dados Pessoais ──────────────────────────────────────

const schemaStep2: FormGridSchema = {
    rows: [
        {
            fields: [
                {
                    col: 12,
                    label: 'Nome Completo',
                    id: 'name',
                    name: 'name',
                    required: true,
                    noNumbers: true,
                    placeholder: 'Seu nome completo',
                    autoComplete: 'name',
                },
                {
                    col: 12,
                    label: 'E-mail',
                    id: 'mail',
                    name: 'mail',
                    required: true,
                    placeholder: 'seu@email.com',
                    inputMode: 'email',
                    autoComplete: 'email',
                },
                {
                    col: 6,
                    label: 'CPF',
                    id: 'cpf',
                    name: 'cpf',
                    type: 'cpf',
                    required: true,
                },
                {
                    col: 6,
                    label: 'WhatsApp',
                    id: 'whatsapp',
                    name: 'whatsapp',
                    type: 'phone',
                    required: true,
                },
                {
                    col: 6,
                    label: 'Telefone',
                    id: 'phone',
                    name: 'phone',
                    type: 'phone',
                },
                {
                    col: 6,
                    label: 'Data de Nascimento',
                    id: 'date_birth',
                    name: 'date_birth',
                    type: 'data',
                },
                {
                    col: 4,
                    label: 'CEP',
                    id: 'zip_code',
                    name: 'zip_code',
                    type: 'cep',
                },
                {
                    col: 8,
                    label: 'Endereço',
                    id: 'address',
                    name: 'address',
                    placeholder: 'Rua, número, bairro',
                    autoComplete: 'street-address',
                },
            ],
        },
    ],
}

// ─── Validação de senha ───────────────────────────────────────────────────────

function validatePasswords(pass: string, confirm: string): string | null {
    if (pass.length > 0 && pass.length < 6) return 'A senha deve ter pelo menos 6 caracteres'
    if (confirm.length > 0 && pass !== confirm) return 'As senhas não conferem'
    return null
}

// ─── Stepper visual ───────────────────────────────────────────────────────────

function StepIndicator({
    current,
    headerStart,
    headerText,
}: {
    current: 1 | 2
    headerStart: string
    headerText: string
}) {
    const activeCircle: React.CSSProperties = {
        width: 28,
        height: 28,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: '0.8rem',
        backgroundColor: '#fff',
        color: headerStart,
    }
    const inactiveCircle: React.CSSProperties = {
        ...activeCircle,
        backgroundColor: 'rgba(255,255,255,0.3)',
        color: headerText,
    }
    const activeLabel: React.CSSProperties = { color: headerText, fontSize: '0.82rem' }
    const inactiveLabel: React.CSSProperties = { ...activeLabel, opacity: 0.55 }

    return (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
            <div style={current === 1 ? activeCircle : inactiveCircle}>1</div>
            <span style={current === 1 ? activeLabel : inactiveLabel}>Acesso</span>
            <div style={{ width: 36, height: 2, backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: 1 }} />
            <div style={current === 2 ? activeCircle : inactiveCircle}>2</div>
            <span style={current === 2 ? activeLabel : inactiveLabel}>Dados Pessoais</span>
        </div>
    )
}

// ─── Componente principal ─────────────────────────────────────────────────────

function UserRegisterForm() {
    const { login: theme } = getActiveTheme()
    const isDev = ENVIRONMENT === 'development'

    const [step, setStep] = useState<1 | 2 | 'done'>(1)
    const [userId, setUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [debugData, setDebugData] = useState<unknown>(null)

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passError, setPassError] = useState<string | null>(null)

    async function handleStep1(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const user = (data.get('user') as string).trim()
        const pass = data.get('password') as string
        const confirm = data.get('confirm_password') as string

        const err = validatePasswords(pass, confirm)
        if (err) { setPassError(err); return }
        setPassError(null)
        setLoading(true)
        setError(null)

        try {
            const res = await createUserManagement({ user, password: pass })
            if (isDev) setDebugData(res)
            if (res.success && res.data?.id) {
                setUserId(res.data.id)
                setStep(2)
            } else {
                setError(res.message || 'Erro ao criar acesso')
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Erro de conexão com o servidor'
            setError(msg)
            if (isDev) setDebugData({ error: msg })
        } finally {
            setLoading(false)
        }
    }

    async function handleStep2(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const data = new FormData(e.currentTarget)

        try {
            const res = await createUserCustomer({
                user_management_id: userId!,
                name: data.get('name') as string,
                mail: data.get('mail') as string,
                cpf: data.get('cpf') as string,
                whatsapp: data.get('whatsapp') as string,
                phone: (data.get('phone') as string) || undefined,
                date_birth: (data.get('date_birth') as string) || undefined,
                zip_code: (data.get('zip_code') as string) || undefined,
                address: (data.get('address') as string) || undefined,
            })
            if (isDev) setDebugData(res)
            if (res.success) {
                setStep('done')
            } else {
                setError(res.message || 'Erro ao salvar dados pessoais')
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Erro de conexão com o servidor'
            setError(msg)
            if (isDev) setDebugData({ error: msg })
        } finally {
            setLoading(false)
        }
    }

    const wrapStyle: React.CSSProperties = {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.bgStart} 0%, ${theme.bgMid} 55%, ${theme.bgEnd} 100%)`,
        padding: '1.5rem',
    }

    const cardStyle: React.CSSProperties = {
        width: '100%',
        maxWidth: 520,
        borderRadius: '1rem',
        backgroundColor: theme.cardBg,
        overflow: 'hidden',
    }

    const headerStyle: React.CSSProperties = {
        background: `linear-gradient(135deg, ${theme.headerStart} 0%, ${theme.headerEnd} 100%)`,
        padding: '2rem 2rem 1.5rem',
        textAlign: 'center',
    }

    const btnStyle: React.CSSProperties = {
        backgroundColor: theme.btnBg,
        borderColor: theme.btnBg,
        color: theme.btnText,
        borderRadius: '0.5rem',
        padding: '0.6rem',
        transition: 'background-color 0.2s',
    }

    // ── Tela de sucesso ──
    if (step === 'done') {
        return (
            <div style={wrapStyle}>
                <div
                    className="card shadow-lg border-0 text-center"
                    style={{ ...cardStyle, padding: '3rem 2rem' }}
                >
                    <div
                        className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3"
                        style={{ width: 64, height: 64, backgroundColor: theme.btnBg }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            fill={theme.btnText}
                            viewBox="0 0 16 16"
                        >
                            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                        </svg>
                    </div>
                    <h5 className="fw-semibold mb-2">Cadastro concluído!</h5>
                    <p className="text-muted mb-4">
                        Sua conta foi criada com sucesso.<br />Agora você já pode entrar no sistema.
                    </p>
                    <Link
                        to="/v1/login"
                        className="btn fw-semibold mx-auto"
                        style={{ ...btnStyle, maxWidth: 200 }}
                    >
                        Ir para o Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <>
            <div style={wrapStyle}>
                <div className="card shadow-lg border-0" style={cardStyle}>

                    {/* ── Cabeçalho ── */}
                    <div style={headerStyle}>
                        <img
                            src={notDefinedImg}
                            alt="Logo"
                            style={{ maxHeight: 64, maxWidth: '100%', objectFit: 'contain', marginBottom: '0.75rem' }}
                        />
                        <h5
                            className="mb-1 fw-semibold"
                            style={{ color: theme.headerText, letterSpacing: '0.03em' }}
                        >
                            Novo Cadastro
                        </h5>
                        <StepIndicator
                            current={step as 1 | 2}
                            headerStart={theme.headerStart}
                            headerText={theme.headerText}
                        />
                    </div>

                    {/* ── Corpo ── */}
                    <div className="card-body px-4 pt-4 pb-3">
                        {error && (
                            <div className="alert alert-danger py-2 mb-3" role="alert">
                                {error}
                            </div>
                        )}

                        {/* ── Etapa 1: Acesso ── */}
                        {step === 1 && (
                            <form onSubmit={handleStep1} noValidate autoComplete="off">
                                <div className="mb-3">
                                    <label htmlFor="user" className="form-label">
                                        Usuário <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="user"
                                        name="user"
                                        className="form-control"
                                        placeholder="Escolha um nome de usuário"
                                        required
                                        autoComplete="username"
                                        autoFocus
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Senha <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className={`form-control${passError && password.length > 0 && password.length < 6 ? ' is-invalid' : ''}`}
                                        placeholder="Mínimo 6 caracteres"
                                        required
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={e => {
                                            setPassword(e.target.value)
                                            setPassError(validatePasswords(e.target.value, confirmPassword))
                                        }}
                                    />
                                </div>

                                <div className="mb-1">
                                    <label htmlFor="confirm_password" className="form-label">
                                        Confirmar Senha <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="confirm_password"
                                        name="confirm_password"
                                        className={`form-control${passError && confirmPassword.length > 0 ? ' is-invalid' : ''}`}
                                        placeholder="Repita a senha"
                                        required
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                        onChange={e => {
                                            setConfirmPassword(e.target.value)
                                            setPassError(validatePasswords(password, e.target.value))
                                        }}
                                    />
                                    {passError && (
                                        <div className="text-danger small mt-1">{passError}</div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn w-100 mt-3 fw-semibold"
                                    disabled={loading}
                                    style={btnStyle}
                                    onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.btnBgHover)}
                                    onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.btnBg)}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                            Verificando…
                                        </>
                                    ) : 'Próxima Etapa →'}
                                </button>
                            </form>
                        )}

                        {/* ── Etapa 2: Dados Pessoais ── */}
                        {step === 2 && (
                            <form onSubmit={handleStep2} noValidate autoComplete="off">
                                <FormGrid schema={schemaStep2} />

                                <button
                                    type="submit"
                                    className="btn w-100 mt-3 fw-semibold"
                                    disabled={loading}
                                    style={btnStyle}
                                    onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.btnBgHover)}
                                    onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.btnBg)}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                            Salvando…
                                        </>
                                    ) : 'Concluir Cadastro'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* ── Rodapé ── */}
                    <div className="d-flex justify-content-between px-4 pb-4 pt-1" style={{ fontSize: '0.85rem' }}>
                        <Link
                            to="/v1/login"
                            style={{ color: theme.link, textDecoration: 'none' }}
                            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = theme.linkHover)}
                            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = theme.link)}
                        >
                            Já tenho conta
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

                    {/* ── DEBUG (apenas development) ── */}
                    {isDev && debugData !== null && (
                        <div className="px-4 pb-4 text-center">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                data-bs-toggle="modal"
                                data-bs-target="#registerDebugModal"
                            >
                                DEBUG
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modal DEBUG ── */}
            {isDev && (
                <div
                    className="modal fade"
                    id="registerDebugModal"
                    tabIndex={-1}
                    aria-labelledby="registerDebugModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="registerDebugModalLabel">
                                    DEBUG — Resposta da API
                                </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar" />
                            </div>
                            <div className="modal-body">
                                <pre
                                    className="mb-0"
                                    style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
                                >
                                    {JSON.stringify(debugData, null, 2)}
                                </pre>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-sm btn-secondary" data-bs-dismiss="modal">
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

export default UserRegisterForm
