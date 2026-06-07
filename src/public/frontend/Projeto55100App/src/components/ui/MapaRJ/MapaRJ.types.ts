export interface MunicipioData {
  nome: string
  populacao: string
  area_km2: string
  observacoes: string
  link: string
  cd_tse?: string
}

export type DadosMap = Record<string, MunicipioData>

export interface MunicipioSelecionado {
  cod: string
  data: MunicipioData
}

export interface MapaRJProps {
  dataUrl?: string
  shapefileBaseUrl?: string
  width?: number
  height?: number
}
