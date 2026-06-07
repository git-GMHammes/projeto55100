import type { ReactNode } from 'react'

export interface ModalProps {
  id: string
  title: string
  body: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'lg' | 'xl'
  scrollable?: boolean
  show: boolean
  onHide: () => void
}
