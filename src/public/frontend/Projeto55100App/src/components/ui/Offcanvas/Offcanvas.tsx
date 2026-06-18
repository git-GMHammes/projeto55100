import { useEffect, useRef } from 'react'
import { Offcanvas as BsOffcanvas } from 'bootstrap'
import type { OffcanvasProps } from './Offcanvas.types'

function Offcanvas({ id, title, body, placement = 'start', show, onHide }: OffcanvasProps) {
  const elRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instanceRef = useRef<any>(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return
    instanceRef.current = new BsOffcanvas(el, { backdrop: true, keyboard: true, scroll: false })
    el.addEventListener('hidden.bs.offcanvas', onHide)
    return () => {
      el.removeEventListener('hidden.bs.offcanvas', onHide)
      instanceRef.current?.dispose()
    }
  }, [])

  useEffect(() => {
    if (!instanceRef.current) return
    show ? instanceRef.current.show() : instanceRef.current.hide()
  }, [show])

  return (
    <div
      ref={elRef}
      id={id}
      className={`offcanvas offcanvas-${placement}`}
      tabIndex={-1}
      aria-labelledby={`${id}-label`}
    >
      <div className="offcanvas-header">
        <h5 id={`${id}-label`} className="offcanvas-title">{title}</h5>
        <button type="button" className="btn-close" aria-label="Fechar" onClick={onHide} />
      </div>
      <div className="offcanvas-body">{body}</div>
    </div>
  )
}

export default Offcanvas
