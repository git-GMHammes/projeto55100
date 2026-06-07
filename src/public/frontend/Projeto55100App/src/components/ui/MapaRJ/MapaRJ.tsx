import { useEffect, useRef, useState } from 'react'
import { useMapaRJ } from './hooks/useMapaRJ'
import { Modal } from '../Modal'
import { getActiveTheme } from '../../../themes/global'
import type { MapaRJProps } from './MapaRJ.types'
import styles from './MapaRJ.module.css'

const DEFAULT_DATA_URL = '/maparj/municipios_rj.json'
const DEFAULT_SHP_URL  = '/maparj/BR_Municipios_2024'
const DEFAULT_HEIGHT   = 700
const SIDEBAR_WIDTH    = 220

function MapaRJ({
  dataUrl = DEFAULT_DATA_URL,
  shapefileBaseUrl = DEFAULT_SHP_URL,
  width: widthProp,
  height = DEFAULT_HEIGHT,
}: MapaRJProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [actualWidth, setActualWidth] = useState<number>(widthProp ?? 0)

  const [hoveredButtonCod, setHoveredButtonCod] = useState<string | null>(null)
  const [pinnedCod, setPinnedCod] = useState<string | null>(null)

  const effectiveCod = hoveredButtonCod ?? pinnedCod

  // Mede a largura real do container do mapa (excluindo a sidebar)
  useEffect(() => {
    const el = mapContainerRef.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      if (w > 0) setActualWidth(w)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { svgRef, municipioSelecionado, modalAberto, fecharModal, carregando, erro, dados } = useMapaRJ({
    dataUrl,
    shapefileBaseUrl,
    width: actualWidth,
    height,
    highlightedCod: effectiveCod,
  })

  const { login: theme } = getActiveTheme()

  const sortedMunicipios = dados
    ? Object.entries(dados).sort(([, a], [, b]) => a.nome.localeCompare(b.nome, 'pt-BR'))
    : []

  function handleButtonMouseEnter(cod: string) {
    setHoveredButtonCod(cod)
  }

  function handleButtonMouseLeave() {
    setHoveredButtonCod(null)
  }

  function handleButtonClick(cod: string) {
    setPinnedCod(prev => (prev === cod ? null : cod))
  }

  const m = municipioSelecionado

  const modalBody = m ? (
    <dl className="row mb-0">
      <dt className="col-5 text-muted fw-normal">Código IBGE</dt>
      <dd className="col-7">{m.cod}</dd>

      <dt className="col-5 text-muted fw-normal">Código TSE</dt>
      <dd className="col-7">{m.data.cd_tse || '—'}</dd>

      <dt className="col-5 text-muted fw-normal">População</dt>
      <dd className="col-7">{m.data.populacao || '—'}</dd>

      <dt className="col-5 text-muted fw-normal">Área (km²)</dt>
      <dd className="col-7">{m.data.area_km2 || '—'}</dd>

      <dt className="col-5 text-muted fw-normal">Observações</dt>
      <dd className="col-7">{m.data.observacoes || '—'}</dd>
    </dl>
  ) : null

  const modalFooter = m?.data.link ? (
    <a href={m.data.link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
      Ver mais
    </a>
  ) : undefined

  return (
    <div className="card shadow-sm" style={{ width: '100%' }}>
      <div className="card-body p-0 d-flex" style={{ overflow: 'hidden' }}>

        {/* Coluna do mapa */}
        <div
          ref={mapContainerRef}
          style={{ flex: 1, minWidth: 0 }}
        >
          {carregando && !erro && (
            <div className="d-flex align-items-center justify-content-center gap-2 py-3 text-secondary">
              <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              <span>Carregando shapefile…</span>
            </div>
          )}
          {erro && (
            <div className="alert alert-danger m-3" role="alert">{erro}</div>
          )}
          <svg
            ref={svgRef}
            viewBox={`0 0 ${actualWidth} ${height}`}
            className={styles.mapa}
            style={{ height: carregando || erro ? 0 : height, overflow: 'hidden' }}
            aria-label="Mapa dos municípios do Rio de Janeiro"
          />
        </div>

        {/* Sidebar de municípios */}
        <div
          style={{
            width: SIDEBAR_WIDTH,
            minWidth: SIDEBAR_WIDTH,
            borderLeft: `1px solid ${theme.headerEnd}33`,
            overflowY: 'auto',
            height,
            display: 'flex',
            flexDirection: 'column',
            padding: '0.5rem',
            gap: '0.25rem',
            background: '#f8f9fa',
          }}
        >
          {sortedMunicipios.length === 0 && !erro && (
            <div className="text-muted small text-center mt-3">Carregando…</div>
          )}
          {sortedMunicipios.map(([cod, info]) => {
            const isPinned  = pinnedCod === cod
            const isHovered = hoveredButtonCod === cod
            const isActive  = isPinned || isHovered

            const btnStyle: React.CSSProperties = isActive
              ? {
                  backgroundColor: theme.btnBg,
                  borderColor: theme.btnBg,
                  color: theme.btnText,
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }
              : {
                  backgroundColor: 'transparent',
                  borderColor: theme.headerStart,
                  color: theme.headerStart,
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }

            return (
              <button
                key={cod}
                type="button"
                className="btn btn-sm"
                style={btnStyle}
                onMouseEnter={() => handleButtonMouseEnter(cod)}
                onMouseLeave={handleButtonMouseLeave}
                onClick={() => handleButtonClick(cod)}
                title={cod}
              >
                {info.nome}
              </button>
            )
          })}
        </div>
      </div>

      <Modal
        id="modal-municipio"
        title={m?.data.nome ?? ''}
        body={modalBody}
        footer={modalFooter}
        size="sm"
        show={modalAberto}
        onHide={fecharModal}
      />
    </div>
  )
}

export default MapaRJ
