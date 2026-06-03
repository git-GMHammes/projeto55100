export const SYSTEM_CODE = 1
export const APP_VERSION = 'V1'

export const ENVIRONMENT = 'development'
// export const ENVIRONMENT = 'production'
// export const ENVIRONMENT = 'test'

// Em produção/test: backend em habilidade.com/projeto55100/src/public
// Em development: backend em porta separada do Vite dev server
export const APP_BASE_HOST = ((ENVIRONMENT as string) === 'production' || (ENVIRONMENT as string) === 'test')
    ? 'https://habilidade.com/projeto55100/src/public'
    : 'http://localhost:55100'
export const THEME = 'Purple'

// export const THEME = 'Dark'
// export const THEME = 'Light'
// export const THEME = 'Green'
// export const THEME = 'Blue'
// export const THEME = 'Red'
