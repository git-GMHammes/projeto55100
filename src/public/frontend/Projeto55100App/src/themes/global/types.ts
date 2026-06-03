export type ThemeName = 'Purple' | 'Dark' | 'Light' | 'Green' | 'Blue' | 'Red'

export interface LoginTheme {
  bgStart: string
  bgMid: string
  bgEnd: string
  cardBg: string
  headerStart: string
  headerEnd: string
  headerText: string
  btnBg: string
  btnBgHover: string
  btnText: string
  link: string
  linkHover: string
}

export interface GlobalTheme {
  name: ThemeName
  login: LoginTheme
}
