import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import shp from 'shpjs'
import type { DadosMap, MunicipioData, MunicipioSelecionado } from '../MapaRJ.types'

const COR_PADRAO   = '#4a9eda'
const COR_DESTAQUE = '#1a6ca8'

interface UseMapaRJOptions {
  dataUrl: string
  shapefileBaseUrl: string
  width: number
  height: number
  highlightedCod?: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeoFeature = any

interface FetchedData {
  dados: DadosMap
  features: GeoFeature[]
}

export function useMapaRJ({ dataUrl, shapefileBaseUrl, width, height, highlightedCod }: UseMapaRJOptions) {
  const svgRef = useRef<SVGSVGElement>(null)
  const highlightedCodRef = useRef<string | null>(null)
  const [municipioSelecionado, setMunicipioSelecionado] = useState<MunicipioSelecionado | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [fetchedData, setFetchedData] = useState<FetchedData | null>(null)
  const [hoveredMapCod, setHoveredMapCod] = useState<string | null>(null)
  const setHoveredMapCodRef = useRef(setHoveredMapCod)
  const hoveredMapCodRef    = useRef<string | null>(null)

  // Mantém ref sincronizada com a prop para uso nos handlers D3
  useEffect(() => {
    highlightedCodRef.current = highlightedCod ?? null
  }, [highlightedCod])

  // Effect 1 — busca os dados uma única vez por URL
  useEffect(() => {
    let cancelado = false
    setCarregando(true)
    setErro(null)

    async function fetchData() {
      try {
        const dados: DadosMap = await fetch(dataUrl).then(r => r.json())
        const shpUrl = shapefileBaseUrl.startsWith('http')
          ? shapefileBaseUrl
          : new URL(shapefileBaseUrl, window.location.href).href
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const geo: any = await shp(shpUrl)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const features = (geo.features as any[]).filter((f: any) => f.properties.CD_UF === '33')
        if (!cancelado) setFetchedData({ dados, features })
      } catch {
        if (!cancelado) setErro('Erro ao carregar o mapa. Verifique os arquivos em public/maparj/.')
      }
    }

    fetchData()
    return () => { cancelado = true }
  }, [dataUrl, shapefileBaseUrl])

  // Effect 2 — renderiza o D3 sempre que os dados ou as dimensões mudam
  useEffect(() => {
    if (!fetchedData || !svgRef.current || width <= 0) return

    const { dados, features } = fetchedData
    const rj = { type: 'FeatureCollection', features } as d3.ExtendedFeatureCollection

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const projection = d3.geoMercator().fitSize([width, height], rj)
    const pathGen = d3.geoPath().projection(projection)

    svg
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .selectAll<SVGPathElement, any>('path')
      .data(features)
      .enter()
      .append('path')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr('d', (d: any) => pathGen(d) ?? '')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr('data-cod', (d: any) => d.properties.CD_MUN)
      .style('fill', COR_PADRAO)
      .style('stroke', '#fff')
      .style('stroke-width', '0.5')
      .style('cursor', 'pointer')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on('mouseenter', function (this: any, _event: any, d: any) {
        d3.select(this).style('fill', COR_DESTAQUE)
        hoveredMapCodRef.current = d.properties.CD_MUN
        setHoveredMapCodRef.current(d.properties.CD_MUN)
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on('mouseleave', function (this: any, _event: any, d: any) {
        const cod: string = d.properties.CD_MUN
        if (cod !== highlightedCodRef.current) {
          d3.select(this).style('fill', COR_PADRAO)
        }
        hoveredMapCodRef.current = null
        setHoveredMapCodRef.current(null)
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on('click', (_event: any, d: any) => {
        const cod: string = d.properties.CD_MUN
        if (cod !== highlightedCodRef.current && cod !== hoveredMapCodRef.current) return
        const data: MunicipioData = dados[cod] ?? {
          nome: d.properties.NM_MUN,
          populacao: '',
          area_km2: '',
          observacoes: '',
          link: '',
        }
        setMunicipioSelecionado({ cod, data })
        setModalAberto(true)
      })

    setCarregando(false)
  }, [fetchedData, width, height])

  // Effect 3 — atualiza cores D3 quando highlightedCod muda
  useEffect(() => {
    if (!svgRef.current || !fetchedData) return
    const svg = d3.select(svgRef.current)
    svg.selectAll<SVGPathElement, GeoFeature>('path').each(function () {
      const cod = d3.select(this).attr('data-cod')
      d3.select(this).style('fill', cod === (highlightedCod ?? null) ? COR_DESTAQUE : COR_PADRAO)
    })
  }, [highlightedCod, fetchedData])

  function fecharModal() {
    setModalAberto(false)
  }

  return {
    svgRef,
    municipioSelecionado,
    modalAberto,
    fecharModal,
    carregando,
    erro,
    dados: fetchedData?.dados ?? null,
    hoveredMapCod,
  }
}
