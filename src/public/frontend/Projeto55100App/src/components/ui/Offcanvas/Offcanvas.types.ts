import type { ReactNode } from 'react'

export interface OffcanvasProps {
  id: string
  title: string
  body: ReactNode
  placement?: 'start' | 'end' | 'top' | 'bottom'
  show: boolean
  onHide: () => void
}
