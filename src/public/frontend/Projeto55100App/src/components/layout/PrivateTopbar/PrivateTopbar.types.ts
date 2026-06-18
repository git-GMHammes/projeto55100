export interface PrivateTopbarProps {
  username: string
  onLogout: () => void
  theme: {
    headerText: string
    btnBg: string
    btnBgHover?: string
    btnText: string
  }
}
