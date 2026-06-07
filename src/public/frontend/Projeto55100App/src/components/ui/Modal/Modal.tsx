import { useEffect, useRef } from 'react'
import { Modal as BsModal } from 'bootstrap'
import type { ModalProps } from './Modal.types'

function Modal({ id, title, body, footer, size, scrollable = false, show, onHide }: ModalProps) {
  const elRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instanceRef = useRef<any>(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return
    instanceRef.current = new BsModal(el, { backdrop: true, keyboard: true })
    el.addEventListener('hidden.bs.modal', onHide)
    return () => {
      el.removeEventListener('hidden.bs.modal', onHide)
      instanceRef.current?.dispose()
    }
  }, [])

  useEffect(() => {
    if (!instanceRef.current) return
    show ? instanceRef.current.show() : instanceRef.current.hide()
  }, [show])

  const dialogClass = [
    'modal-dialog',
    size ? `modal-${size}` : '',
    scrollable ? 'modal-dialog-scrollable' : '',
  ].filter(Boolean).join(' ')

  return (
    <div ref={elRef} id={id} className="modal fade" tabIndex={-1} aria-modal="true" role="dialog">
      <div className={dialogClass}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" aria-label="Fechar" onClick={onHide} />
          </div>
          <div className="modal-body">{body}</div>
          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </div>
  )
}

export default Modal
