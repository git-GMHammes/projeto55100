/* =====================================================
   DASHBOARD ELEITORAL RJ — Logic & Charts
   ===================================================== */

const fmt  = n => n?.toLocaleString('pt-BR') ?? '—';
const pct  = n => (n * 100).toFixed(1) + '%';

// ── Relógio ──────────────────────────────────────────
function startClock() {
  const el = document.getElementById('clock');
  const tick = () => {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('pt-BR');
  };
  tick(); setInterval(tick, 1000);
}

// ── Countdown de atualização ─────────────────────────
let countdownSecs = 60;
function startCountdown(onTick) {
  const fill = document.getElementById('countdown-fill');
  const label = document.getElementById('next-update-label');
  setInterval(() => {
    countdownSecs--;
    if (countdownSecs < 0) countdownSecs = 60;
    const pct = (countdownSecs / 60) * 100;
    fill.style.width = pct + '%';
    label.textContent = `Próxima atualização em ${countdownSecs}s`;
    if (countdownSecs === 0) onTick();
  }, 1000);
}

// ── KPIs ─────────────────────────────────────────────
function animateNum(el, targetVal, duration = 800) {
  const start = parseInt(el.dataset.current || '0');
  const diff = targetVal - start;
  const steps = duration / 16;
  let step = 0;
  el.classList.add('updating');
  const timer = setInterval(() => {
    step++;
    const val = Math.round(start + diff * (step / steps));
    el.textContent = fmt(val);
    if (step >= steps) {
      el.textContent = fmt(targetVal);
      el.dataset.current = targetVal;
      el.classList.remove('updating');
      clearInterval(timer);
    }
  }, 16);
}

function renderKPIs(kpi) {
  const ids = [
    ['kpi-eleitores',      kpi.totalEleitores,    null],
    ['kpi-votos-validos',  kpi.votosValidos2024,   null],
    ['kpi-brancos',        kpi.votosBrancos2024,   null],
    ['kpi-nulos',          kpi.votosNulos2024,     null],
    ['kpi-participacao',   null,                   pct(kpi.participacao2024)],
    ['kpi-candidatos',     kpi.totalCandidatos2024, null],
    ['kpi-partidos',       kpi.partidos2024,        null],
    ['kpi-apurados',       kpi.municipiosApurados,  null],
  ];
  ids.forEach(([id, num, str]) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (str) { el.textContent = str; return; }
    animateNum(el, num);
  });

  // Barra de apuração
  const pctAp = (kpi.municipiosApurados / kpi.totalMunicipios) * 100;
  const barEl = document.getElementById('apuracao-fill');
  if (barEl) barEl.style.width = pctAp.toFixed(1) + '%';
  const apLbl = document.getElementById('apuracao-pct');
  if (apLbl) apLbl.textContent = pctAp.toFixed(1) + '%';
}

// ── Candidatos ───────────────────────────────────────
function renderCandidatos(candidatos) {
  const grid = document.getElementById('candidatos-grid');
  const maxVotos = Math.max(...candidatos.flatMap(c => c.eleicoes.map(e => e.votos)));

  grid.innerHTML = candidatos.map(c => {
    const e22 = c.eleicoes[0]; // 2022
    const e24 = c.eleicoes[1]; // 2024
    const initials = c.nome.split(' ').slice(0,2).map(w => w[0]).join('');
    const eleito24 = e24.resultado.startsWith('Eleito') || e24.resultado.startsWith('Eleita');
    const eleito22 = e22.resultado.startsWith('Eleito') || e22.resultado.startsWith('Eleita');
    const pct22 = ((e22.votos / maxVotos) * 100).toFixed(1);
    const pct24 = ((e24.votos / maxVotos) * 100).toFixed(1);

    return `
    <div class="candidato-card">
      <div class="cand-header">
        <div class="cand-avatar ${eleito24 ? 'eleito' : 'neleito'}">${initials}</div>
        <div class="cand-info">
          <div class="cand-nome" title="${c.nome}">${c.nome}</div>
          <div class="cand-numero">Nº ${c.numero}</div>
          <span class="cand-partido-badge">${c.partido}</span>
        </div>
      </div>
      <div class="eleicao-row">
        <div class="eleicao-box">
          <div class="eleicao-ano">2022</div>
          <div class="eleicao-cargo">${e22.cargo}</div>
          <div class="eleicao-votos">${fmt(e22.votos)}</div>
          <span class="eleicao-resultado ${eleito22 ? 'resultado-eleito' : 'resultado-neleito'}">${e22.resultado}</span>
          <div class="votos-bar-wrap">
            <div class="votos-bar"><div class="votos-bar-fill a22" style="width:${pct22}%"></div></div>
          </div>
          <div class="coligacao-tags">${e22.coligacao.map(p => `<span class="coligacao-tag">${p}</span>`).join('')}</div>
        </div>
        <div class="eleicao-box">
          <div class="eleicao-ano">2024</div>
          <div class="eleicao-cargo">${e24.cargo}</div>
          <div class="eleicao-votos">${fmt(e24.votos)}</div>
          <span class="eleicao-resultado ${eleito24 ? 'resultado-eleito' : 'resultado-neleito'}">${e24.resultado}</span>
          <div class="votos-bar-wrap">
            <div class="votos-bar"><div class="votos-bar-fill a24" style="width:${pct24}%"></div></div>
          </div>
          <div class="coligacao-tags">${e24.coligacao.map(p => `<span class="coligacao-tag">${p}</span>`).join('')}</div>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── D3 Force Graph ───────────────────────────────────
let simulation;
function renderForceGraph(data) {
  const wrap = document.getElementById('force-svg');
  const W = wrap.clientWidth || 900;
  const H = 520;

  d3.select('#force-svg').selectAll('*').remove();

  const svg = d3.select('#force-svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('width', W).attr('height', H);

  const defs = svg.append('defs');
  // Gradiente de fundo
  const grad = defs.append('radialGradient').attr('id','bg-grad');
  grad.append('stop').attr('offset','0%').attr('stop-color','#111d35');
  grad.append('stop').attr('offset','100%').attr('stop-color','#060a12');
  svg.append('rect').attr('width',W).attr('height',H).attr('fill','url(#bg-grad)');

  // Seta
  defs.append('marker').attr('id','arrow')
    .attr('viewBox','0 -5 10 10').attr('refX',18).attr('refY',0)
    .attr('markerWidth',6).attr('markerHeight',6).attr('orient','auto')
    .append('path').attr('d','M0,-5L10,0L0,5').attr('fill','#2563eb66');

  const tooltip = document.getElementById('d3-tooltip');

  const links = data.links.map(l => ({...l}));
  const nodes = data.nodes.map(n => ({...n}));

  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(d => d.tipo === 'coligacao' ? 90 : 130).strength(0.6))
    .force('charge', d3.forceManyBody().strength(d => d.tipo === 'candidato' ? -320 : -200))
    .force('center', d3.forceCenter(W/2, H/2))
    .force('collision', d3.forceCollide(d => d.tipo === 'candidato' ? 40 : 28));

  // Links
  const link = svg.append('g').selectAll('line').data(links).join('line')
    .attr('stroke', d => d.tipo === 'coligacao' ? '#f59e0b55' : '#2563eb44')
    .attr('stroke-width', d => d.tipo === 'coligacao' ? 1.5 : 1)
    .attr('stroke-dasharray', d => d.tipo === 'coligacao' ? '5,3' : null)
    .attr('marker-end', d => d.tipo === 'filiacao' ? 'url(#arrow)' : null);

  // Nós
  const node = svg.append('g').selectAll('g').data(nodes).join('g')
    .call(d3.drag()
      .on('start', (event, d) => { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx=d.x; d.fy=d.y; })
      .on('drag',  (event, d) => { d.fx=event.x; d.fy=event.y; })
      .on('end',   (event, d) => { if (!event.active) simulation.alphaTarget(0); d.fx=null; d.fy=null; }));

  // Círculo de fundo (glow)
  node.filter(d => d.tipo === 'candidato').append('circle')
    .attr('r', 30).attr('fill', 'none')
    .attr('stroke', d => FakeAPI.partidos.find(p => p.sigla === d.partido)?.cor || '#2563eb')
    .attr('stroke-width', 1.5).attr('opacity', 0.3);

  // Círculo principal
  node.append('circle')
    .attr('r', d => d.tipo === 'candidato' ? 24 : 18)
    .attr('fill', d => {
      if (d.tipo === 'candidato') {
        const cor = FakeAPI.partidos.find(p => p.sigla === d.partido)?.cor || '#2563eb';
        return cor + '33';
      }
      const cor = FakeAPI.partidos.find(p => p.sigla === d.label)?.cor || '#7c3aed';
      return cor + '55';
    })
    .attr('stroke', d => {
      if (d.tipo === 'candidato') return FakeAPI.partidos.find(p => p.sigla === d.partido)?.cor || '#2563eb';
      return FakeAPI.partidos.find(p => p.sigla === d.label)?.cor || '#7c3aed';
    })
    .attr('stroke-width', 2);

  // Labels
  node.append('text')
    .text(d => d.tipo === 'partido' ? d.label : d.label.split(' ')[0])
    .attr('text-anchor','middle').attr('dominant-baseline','middle')
    .attr('font-size', d => d.tipo === 'partido' ? '9px' : '8px')
    .attr('font-weight','700')
    .attr('fill', d => {
      if (d.tipo === 'partido') return FakeAPI.partidos.find(p => p.sigla === d.label)?.cor || '#fff';
      return '#e2e8f0';
    });

  // Segunda linha para candidatos
  node.filter(d => d.tipo === 'candidato' && d.label.includes(' ')).append('text')
    .text(d => d.label.split(' ')[1] || '')
    .attr('text-anchor','middle').attr('dominant-baseline','middle')
    .attr('dy', '10px').attr('font-size','7px').attr('fill','#94a3b8');

  // Tooltip
  node.on('mousemove', (event, d) => {
    let html = '';
    if (d.tipo === 'candidato') {
      html = `<strong>${d.label}</strong><br>Partido: <b>${d.partido}</b><br>Votos 2024: <b>${fmt(d.votos2024)}</b><br>Votos 2022: <b>${fmt(d.votos2022)}</b>`;
    } else {
      const p = FakeAPI.partidos.find(x => x.sigla === d.label);
      html = `<strong>${d.label}</strong><br>${p?.nome || ''}`;
    }
    tooltip.innerHTML = html;
    tooltip.style.opacity = '1';
    tooltip.style.left = (event.clientX + 14) + 'px';
    tooltip.style.top  = (event.clientY - 10) + 'px';
  }).on('mouseleave', () => { tooltip.style.opacity = '0'; });

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
    node.attr('transform', d => `translate(${Math.max(28, Math.min(W-28, d.x))},${Math.max(28, Math.min(H-28, d.y))})`);
  });
}

// ── Chart.js: Votos por Partido 2024 ─────────────────
let chartPartido2024, chartPartido2022, chartDonut, chartLinha;

function renderChartPartido2024(data) {
  const ctx = document.getElementById('chart-partido-2024').getContext('2d');
  const cfg = {
    type: 'bar',
    data: {
      labels: data.map(p => p.sigla),
      datasets: [{
        label: 'Votos 2024',
        data: data.map(p => p.votos),
        backgroundColor: data.map(p => p.cor + 'aa'),
        borderColor: data.map(p => p.cor),
        borderWidth: 1.5, borderRadius: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `Votos: ${fmt(ctx.raw)}`
          }
        }
      },
      scales: {
        x: { ticks: { color: '#64748b' }, grid: { color: '#1e3a6e33' } },
        y: { ticks: { color: '#64748b', callback: v => (v/1e6).toFixed(1)+'M' }, grid: { color: '#1e3a6e44' } }
      }
    }
  };
  if (chartPartido2024) { chartPartido2024.data.datasets[0].data = data.map(p => p.votos); chartPartido2024.update('active'); return; }
  chartPartido2024 = new Chart(ctx, cfg);
}

function renderChartPartido2022(data) {
  const ctx = document.getElementById('chart-partido-2022').getContext('2d');
  const cfg = {
    type: 'bar',
    data: {
      labels: data.map(p => p.sigla),
      datasets: [{
        label: 'Votos 2022',
        data: data.map(p => p.votos),
        backgroundColor: data.map(p => p.cor + '88'),
        borderColor: data.map(p => p.cor),
        borderWidth: 1.5, borderRadius: 6,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `Votos: ${fmt(ctx.raw)}` } }
      },
      scales: {
        x: { ticks: { color: '#64748b', callback: v => (v/1e6).toFixed(1)+'M' }, grid: { color: '#1e3a6e44' } },
        y: { ticks: { color: '#64748b' }, grid: { color: '#1e3a6e22' } }
      }
    }
  };
  if (chartPartido2022) { chartPartido2022.data.datasets[0].data = data.map(p => p.votos); chartPartido2022.update('active'); return; }
  chartPartido2022 = new Chart(ctx, cfg);
}

function renderChartDonut(kpi) {
  const ctx = document.getElementById('chart-donut').getContext('2d');
  const data = [kpi.votosValidos2024, kpi.votosBrancos2024, kpi.votosNulos2024];
  const cfg = {
    type: 'doughnut',
    data: {
      labels: ['Votos Válidos', 'Votos Brancos', 'Votos Nulos'],
      datasets: [{ data, backgroundColor: ['#2563ebbb','#f59e0bbb','#ef4444bb'], borderColor: ['#2563eb','#f59e0b','#ef4444'], borderWidth: 2, hoverOffset: 8 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#94a3b8', font: { size: 11 }, padding: 16, boxWidth: 12 }
        },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${fmt(ctx.raw)}` } }
      }
    }
  };
  if (chartDonut) { chartDonut.data.datasets[0].data = data; chartDonut.update('active'); return; }
  chartDonut = new Chart(ctx, cfg);
}

function renderChartLinha(serie) {
  const ctx = document.getElementById('chart-linha').getContext('2d');
  const cfg = {
    type: 'line',
    data: {
      labels: serie.map(s => s.hora),
      datasets: [
        {
          label: 'Votos por hora',
          data: serie.map(s => s.votos),
          borderColor: '#2563eb', backgroundColor: '#2563eb22',
          borderWidth: 2, fill: true, tension: 0.4, pointRadius: 4,
          pointBackgroundColor: '#2563eb',
        },
        {
          label: 'Acumulado',
          data: serie.map(s => s.acumulado),
          borderColor: '#f59e0b', backgroundColor: 'transparent',
          borderWidth: 2, fill: false, tension: 0.4, pointRadius: 3,
          pointBackgroundColor: '#f59e0b', borderDash: [6,3],
          yAxisID: 'y2'
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 12 } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${fmt(ctx.raw)}` } }
      },
      scales: {
        x: { ticks: { color: '#64748b' }, grid: { color: '#1e3a6e33' } },
        y:  { ticks: { color: '#64748b', callback: v => (v/1e3).toFixed(0)+'k' }, grid: { color: '#1e3a6e44' } },
        y2: { position: 'right', ticks: { color: '#f59e0b88', callback: v => (v/1e6).toFixed(1)+'M' }, grid: { display: false } }
      }
    }
  };
  if (chartLinha) {
    chartLinha.data.labels = serie.map(s => s.hora);
    chartLinha.data.datasets[0].data = serie.map(s => s.votos);
    chartLinha.data.datasets[1].data = serie.map(s => s.acumulado);
    chartLinha.update('active'); return;
  }
  chartLinha = new Chart(ctx, cfg);
}

// ── Tabela Municípios ─────────────────────────────────
function renderMunicipios(municipios) {
  const tbody = document.getElementById('municipios-tbody');
  tbody.innerHTML = municipios.slice(0, 30).map((m, i) => {
    const rankClass = i === 0 ? 'r1' : i === 1 ? 'r2' : i === 2 ? 'r3' : '';
    return `<tr>
      <td><span class="rank-badge ${rankClass}">${i+1}</span>${m.nome}</td>
      <td>${fmt(m.eleitores)}</td>
      <td>${fmt(m.votosValidos)}</td>
      <td>${fmt(m.votosBrancos)}</td>
      <td>${fmt(m.votosNulos)}</td>
      <td>${pct(m.participacao)}</td>
      <td>${m.candidatos}</td>
    </tr>`;
  }).join('');
}

// ── Render completo ───────────────────────────────────
function renderAll() {
  renderKPIs(FakeAPI.kpi);
  renderCandidatos(FakeAPI.candidatos);
  renderChartPartido2024(FakeAPI.votosPartido2024);
  renderChartPartido2022(FakeAPI.votosPartido2022);
  renderChartDonut(FakeAPI.kpi);
  renderChartLinha(FakeAPI.serieTemporal);
  renderMunicipios(FakeAPI.municipios);
}

// ── Partidos ranking ─────────────────────────────────
function renderPartidoRanking(data) {
  const el = document.getElementById('partido-ranking');
  const max = Math.max(...data.map(p => p.votos));
  el.innerHTML = data.map((p, i) => `
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
        <span><span class="part-color-dot" style="background:${p.cor}"></span><b>${p.sigla}</b> — ${p.nome}</span>
        <span style="color:#94a3b8">${fmt(p.votos)}</span>
      </div>
      <div style="height:6px;background:#1e3a6e;border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${((p.votos/max)*100).toFixed(1)}%;background:${p.cor};border-radius:3px;transition:width 1s ease"></div>
      </div>
    </div>
  `).join('');
}

// ── Init ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Chart.defaults.color = '#64748b';
  Chart.defaults.borderColor = '#1e3a6e44';

  startClock();
  renderAll();
  renderPartidoRanking(FakeAPI.votosPartido2024);
  renderForceGraph(FakeAPI.forceGraph);

  startCountdown(() => {
    FakeAPI.refresh();
    renderAll();
    renderPartidoRanking(FakeAPI.votosPartido2024);
  });

  // Resize force graph
  window.addEventListener('resize', () => {
    if (simulation) simulation.stop();
    renderForceGraph(FakeAPI.forceGraph);
  });
});
