import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { combine, parseShp, parseDbf } from 'shpjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const baseDir = join(__dirname, 'public', 'maparj')
const base = join(baseDir, 'BR_Municipios_2024')

console.log('Lendo shapefile...')

const shpBuf = readFileSync(base + '.shp')
const dbfBuf = readFileSync(base + '.dbf')

const geo = combine([parseShp(shpBuf), parseDbf(dbfBuf)])

console.log(`Total de features: ${geo.features.length}`)

const rj = {
  type: 'FeatureCollection',
  features: geo.features.filter(f => f.properties.CD_UF === '33'),
}

console.log(`Features RJ (CD_UF=33): ${rj.features.length}`)

const out = join(baseDir, 'rj_municipios.geojson')
writeFileSync(out, JSON.stringify(rj))
console.log(`Salvo em: ${out}`)
console.log(`Tamanho: ${(Buffer.byteLength(JSON.stringify(rj)) / 1024 / 1024).toFixed(2)} MB`)
