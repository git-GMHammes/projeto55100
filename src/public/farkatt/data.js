// ============================================================
// FAKE API — Dados simulados para Dashboard Eleitoral RJ
// ============================================================

const MUNICIPIOS_RJ = [
  "Angra dos Reis","Aperibé","Araruama","Areal","Armação dos Búzios","Arraial do Cabo",
  "Barra do Piraí","Barra Mansa","Belford Roxo","Bom Jardim","Bom Jesus do Itabapoana",
  "Cabo Frio","Cachoeiras de Macacu","Cambuci","Carapebus","Cardoso Moreira","Carmo",
  "Casimiro de Abreu","Comendador Levy Gasparian","Conceição de Macabu","Cordeiro",
  "Duas Barras","Duque de Caxias","Engenheiro Paulo de Frontin","Guapimirim","Iguaba Grande",
  "Itaboraí","Itaguaí","Italva","Itaocara","Itaperuna","Itatiaia","Japeri","Laje do Muriaé",
  "Macaé","Macuco","Magé","Mangaratiba","Maricá","Mendes","Mesquita","Miguel Pereira",
  "Miracema","Natividade","Nilópolis","Niterói","Nova Friburgo","Nova Iguaçu","Paracambi",
  "Paraíba do Sul","Paraty","Paty do Alferes","Petrópolis","Pinheiral","Piraí","Porciúncula",
  "Porto Real","Quatis","Queimados","Quissamã","Resende","Rio Bonito","Rio Claro",
  "Rio das Flores","Rio das Ostras","Rio de Janeiro","Santa Maria Madalena","Santo Antônio de Pádua",
  "São Fidélis","São Francisco de Itabapoana","São Gonçalo","São João da Barra","São João de Meriti",
  "São José de Ubá","São José do Vale do Rio Preto","São Pedro da Aldeia","São Sebastião do Alto",
  "Sapucaia","Saquarema","Seropédica","Silva Jardim","Sumidouro","Tanguá","Teresópolis",
  "Trajano de Moraes","Três Rios","Valença","Varre-Sai","Vassouras","Volta Redonda"
];

const PARTIDOS = [
  { sigla: "PL",    nome: "Partido Liberal",              cor: "#1a78c2" },
  { sigla: "PT",    nome: "Partido dos Trabalhadores",    cor: "#cc0000" },
  { sigla: "UNIÃO", nome: "União Brasil",                 cor: "#f5a623" },
  { sigla: "MDB",   nome: "Movimento Democrático Brasileiro", cor: "#00a651" },
  { sigla: "PSD",   nome: "Partido Social Democrático",   cor: "#004a99" },
  { sigla: "PP",    nome: "Progressistas",                cor: "#0066cc" },
  { sigla: "PSDB",  nome: "Partido da Social Democracia Brasileira", cor: "#1a6faf" },
  { sigla: "PDT",   nome: "Partido Democrático Trabalhista", cor: "#e05c00" },
  { sigla: "PSOL",  nome: "Partido Socialismo e Liberdade", cor: "#ff5500" },
  { sigla: "Republicanos", nome: "Republicanos",          cor: "#003399" }
];

const CANDIDATOS = [
  {
    id: 1, nome: "Carlos Eduardo Fontana", numero: "13001",
    partido: "PT", foto: null, genero: "M",
    eleicoes: [
      { ano: 2022, cargo: "Governador", votos: 3_842_110, resultado: "Eleito", coligacao: ["PT","PDT","PSOL"] },
      { ano: 2024, cargo: "Prefeito de Niterói", votos: 187_432, resultado: "Eleito", coligacao: ["PT","MDB"] }
    ]
  },
  {
    id: 2, nome: "Rodrigo Silveira Matos", numero: "22002",
    partido: "PL", foto: null, genero: "M",
    eleicoes: [
      { ano: 2022, cargo: "Senador", votos: 2_614_880, resultado: "Eleito", coligacao: ["PL","PP"] },
      { ano: 2024, cargo: "Prefeito de Nova Iguaçu", votos: 234_108, resultado: "Eleito", coligacao: ["PL","Republicanos"] }
    ]
  },
  {
    id: 3, nome: "Fernanda Lacerda Britto", numero: "44003",
    partido: "UNIÃO", foto: null, genero: "F",
    eleicoes: [
      { ano: 2022, cargo: "Deputada Federal", votos: 158_740, resultado: "Eleita", coligacao: ["UNIÃO","PSD"] },
      { ano: 2024, cargo: "Prefeita de Macaé", votos: 67_890, resultado: "Eleita", coligacao: ["UNIÃO","MDB"] }
    ]
  },
  {
    id: 4, nome: "Paulo Roberto Azevedo", numero: "55004",
    partido: "PSD", foto: null, genero: "M",
    eleicoes: [
      { ano: 2022, cargo: "Deputado Estadual", votos: 89_320, resultado: "Eleito", coligacao: ["PSD","PSDB"] },
      { ano: 2024, cargo: "Prefeito de Petrópolis", votos: 112_540, resultado: "Eleito", coligacao: ["PSD","PP"] }
    ]
  },
  {
    id: 5, nome: "Ana Claudia Moreira Santos", numero: "12005",
    partido: "MDB", foto: null, genero: "F",
    eleicoes: [
      { ano: 2022, cargo: "Senadora", votos: 1_987_634, resultado: "Não Eleita", coligacao: ["MDB","PDT"] },
      { ano: 2024, cargo: "Prefeita de Volta Redonda", votos: 98_217, resultado: "Eleita", coligacao: ["MDB","PT"] }
    ]
  },
  {
    id: 6, nome: "Thiago Nascimento Rocha", numero: "33006",
    partido: "PP", foto: null, genero: "M",
    eleicoes: [
      { ano: 2022, cargo: "Deputado Federal", votos: 112_458, resultado: "Eleito", coligacao: ["PP","PL"] },
      { ano: 2024, cargo: "Prefeito de Resende", votos: 54_320, resultado: "Eleito", coligacao: ["PP","UNIÃO"] }
    ]
  },
  {
    id: 7, nome: "Juliana Campos Figueiredo", numero: "65007",
    partido: "PDT", foto: null, genero: "F",
    eleicoes: [
      { ano: 2022, cargo: "Deputada Estadual", votos: 74_210, resultado: "Eleita", coligacao: ["PDT","PT"] },
      { ano: 2024, cargo: "Prefeita de Campos dos Goytacazes", votos: 143_670, resultado: "Eleita", coligacao: ["PDT","MDB"] }
    ]
  },
  {
    id: 8, nome: "Marcelo Henrique Vieira", numero: "50008",
    partido: "PSOL", foto: null, genero: "M",
    eleicoes: [
      { ano: 2022, cargo: "Deputado Federal", votos: 64_890, resultado: "Eleito", coligacao: ["PSOL","PT"] },
      { ano: 2024, cargo: "Prefeito de São Gonçalo", votos: 87_430, resultado: "Não Eleito", coligacao: ["PSOL"] }
    ]
  },
  {
    id: 9, nome: "Beatriz Alves Monteiro", numero: "10009",
    partido: "Republicanos", foto: null, genero: "F",
    eleicoes: [
      { ano: 2022, cargo: "Senadora", votos: 2_214_500, resultado: "Eleita", coligacao: ["Republicanos","PL","PP"] },
      { ano: 2024, cargo: "Prefeita de Duque de Caxias", votos: 198_340, resultado: "Eleita", coligacao: ["Republicanos","PSD"] }
    ]
  },
  {
    id: 10, nome: "Roberto Cesar Queiroz", numero: "45010",
    partido: "PSDB", foto: null, genero: "M",
    eleicoes: [
      { ano: 2022, cargo: "Governador", votos: 1_124_330, resultado: "Não Eleito", coligacao: ["PSDB","UNIÃO"] },
      { ano: 2024, cargo: "Prefeito de Teresópolis", votos: 78_910, resultado: "Eleito", coligacao: ["PSDB","MDB"] }
    ]
  }
];

// KPIs base (simulam estado em tempo real)
const KPI_BASE = {
  totalEleitores: 12_847_390,
  votosValidos2024: 7_234_118,
  votosBrancos2024: 412_340,
  votosNulos2024: 287_120,
  participacao2024: 0.613,
  totalCandidatos2024: 48,
  partidos2024: 10,
  municipiosApurados: 87,
  totalMunicipios: 92
};

function gerarMunicipiosData() {
  return MUNICIPIOS_RJ.map((nome, i) => {
    const base = Math.floor(Math.random() * 480000) + 8000;
    const participacao = 0.45 + Math.random() * 0.40;
    const total = Math.floor(base * participacao);
    const brancos = Math.floor(total * (0.03 + Math.random() * 0.04));
    const nulos = Math.floor(total * (0.02 + Math.random() * 0.03));
    return {
      nome,
      eleitores: base,
      votosValidos: total - brancos - nulos,
      votosBrancos: brancos,
      votosNulos: nulos,
      participacao: participacao,
      candidatos: Math.floor(Math.random() * 6) + 2
    };
  }).sort((a, b) => b.eleitores - a.eleitores);
}

function gerarVotosPartido2024() {
  return PARTIDOS.map(p => ({
    ...p,
    votos: Math.floor(Math.random() * 900000) + 80000,
    vereadores: Math.floor(Math.random() * 40) + 2,
    prefeitos: Math.floor(Math.random() * 8) + 1
  })).sort((a, b) => b.votos - a.votos);
}

function gerarVotosPartido2022() {
  return PARTIDOS.map(p => ({
    ...p,
    votos: Math.floor(Math.random() * 1200000) + 100000,
    deputadosFederais: Math.floor(Math.random() * 10) + 1,
    deputadosEstaduais: Math.floor(Math.random() * 15) + 1
  })).sort((a, b) => b.votos - a.votos);
}

function gerarSerieTemporal() {
  const horas = [];
  let acumulado = 0;
  for (let h = 7; h <= 17; h++) {
    const voto = Math.floor(Math.random() * 820000) + 120000;
    acumulado += voto;
    horas.push({ hora: `${String(h).padStart(2,'0')}:00`, votos: voto, acumulado });
  }
  return horas;
}

function gerarForceGraphData() {
  const nodes = [];
  const links = [];

  // Nós: candidatos
  CANDIDATOS.forEach(c => {
    nodes.push({ id: `cand_${c.id}`, label: c.nome.split(' ').slice(0,2).join(' '), tipo: 'candidato', partido: c.partido, votos2024: c.eleicoes[1].votos, votos2022: c.eleicoes[0].votos });
  });

  // Nós: partidos
  PARTIDOS.forEach(p => {
    nodes.push({ id: `part_${p.sigla}`, label: p.sigla, tipo: 'partido', cor: p.cor });
  });

  // Links candidato → partido
  CANDIDATOS.forEach(c => {
    links.push({ source: `cand_${c.id}`, target: `part_${c.partido}`, tipo: 'filiacao', valor: 3 });
  });

  // Links coligação (entre partidos)
  const coligacoes = new Set();
  CANDIDATOS.forEach(c => {
    c.eleicoes.forEach(e => {
      for (let i = 0; i < e.coligacao.length - 1; i++) {
        const key = [e.coligacao[i], e.coligacao[i+1]].sort().join('-');
        if (!coligacoes.has(key)) {
          coligacoes.add(key);
          links.push({ source: `part_${e.coligacao[i]}`, target: `part_${e.coligacao[i+1]}`, tipo: 'coligacao', valor: 1.5 });
        }
      }
    });
  });

  return { nodes, links };
}

// Export global
const FakeAPI = {
  candidatos: CANDIDATOS,
  partidos: PARTIDOS,
  municipios: gerarMunicipiosData(),
  kpi: KPI_BASE,
  votosPartido2024: gerarVotosPartido2024(),
  votosPartido2022: gerarVotosPartido2022(),
  serieTemporal: gerarSerieTemporal(),
  forceGraph: gerarForceGraphData(),
  refresh() {
    this.municipios = gerarMunicipiosData();
    this.votosPartido2024 = gerarVotosPartido2024();
    this.votosPartido2022 = gerarVotosPartido2022();
    this.serieTemporal = gerarSerieTemporal();
    // Variação suave nas KPIs
    this.kpi = {
      ...KPI_BASE,
      votosValidos2024: KPI_BASE.votosValidos2024 + Math.floor((Math.random()-0.5)*12000),
      votosBrancos2024: KPI_BASE.votosBrancos2024 + Math.floor((Math.random()-0.5)*2000),
      votosNulos2024: KPI_BASE.votosNulos2024 + Math.floor((Math.random()-0.5)*1500),
      municipiosApurados: Math.min(92, KPI_BASE.municipiosApurados + Math.floor(Math.random()*3))
    };
  }
};
