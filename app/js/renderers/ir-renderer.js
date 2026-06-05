// IR Spectrum Renderer (ES module)
// Adapted from ir-viewer-prototype.html for the question app.
// Requires D3.js loaded globally.

/** Gaussian smoothing for quantized IR transmittance data. */
function gaussianSmooth(curve, tScale, radius) {
  const n = curve.length;
  const sigma = radius / 2;
  const kernel = [];
  let kernelSum = 0;
  for (let i = -radius; i <= radius; i++) {
    const w = Math.exp(-(i * i) / (2 * sigma * sigma));
    kernel.push(w);
    kernelSum += w;
  }
  for (let i = 0; i < kernel.length; i++) kernel[i] /= kernelSum;

  const result = [];
  for (let i = 0; i < n; i++) {
    let smoothedT = 0;
    for (let k = -radius; k <= radius; k++) {
      const j = Math.max(0, Math.min(n - 1, i + k));
      smoothedT += curve[j].transmittance * tScale * kernel[k + radius];
    }
    result.push({ wavenumber: curve[i].wavenumber, t: smoothedT });
  }
  return result;
}

/** Interpolate smoothed transmittance at a given wavenumber. */
function interpolateSmoothed(sorted, wn) {
  const bisect = d3.bisector(d => d.wavenumber).left;
  const idx = bisect(sorted, wn);
  if (idx <= 0) return sorted[0].t;
  if (idx >= sorted.length) return sorted[sorted.length - 1].t;
  const a = sorted[idx - 1], b = sorted[idx];
  const frac = (wn - a.wavenumber) / (b.wavenumber - a.wavenumber);
  return a.t + frac * (b.t - a.t);
}

/**
 * Render an IR spectrum into a container element.
 * @param {HTMLElement} container - DOM element to render into
 * @param {Object} compound - compound JSON data
 * @param {Object} options - display options
 * @returns {Object} render info: { svg, smoothedCurve, scales }
 */
export function renderIR(container, compound, options = {}) {
  const ir = compound.IR;
  if (!ir) return null;
  const curve = ir.curve || [];
  const labels = ir.signal_labels || {};
  if (curve.length === 0) return null;

  const show = {
    name:          options.showName !== false,
    formula:       options.showFormula !== false,
    mw:            options.showMW !== false,
    signalLabels:  options.showSignalLabels !== false,
    tooltipLabels: options.showTooltipLabels !== false,
  };

  const highlightWn = options.highlightWavenumber || null;

  // Normalize transmittance scale
  const maxT = d3.max(curve, d => d.transmittance);
  const tScale = maxT > 2 ? 1 : 100;

  // Dimensions
  const width = options.width || 800;
  const height = options.height || 380;
  const margin = { top: 40, right: 30, bottom: 55, left: 60 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;

  // Scales
  const x = d3.scaleLinear().domain([4000, 500]).range([0, plotW]);
  const y = d3.scaleLinear().domain([0, 105]).range([plotH, 0]);

  // Clear container
  container.innerHTML = '';

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Clip path
  const clipId = 'ir-clip-' + Math.random().toString(36).slice(2, 8);
  g.append('defs').append('clipPath').attr('id', clipId)
    .append('rect').attr('width', plotW).attr('height', plotH);

  // Background
  g.append('rect').attr('width', plotW).attr('height', plotH).attr('fill', 'white');

  // Grid lines
  const yTicks = [0, 20, 40, 60, 80, 100];
  g.append('g').attr('class', 'grid').selectAll('line').data(yTicks)
    .enter().append('line')
    .attr('x1', 0).attr('x2', plotW)
    .attr('y1', d => y(d)).attr('y2', d => y(d));

  // Axes
  const majorTicks = d3.range(500, 4001, 500);
  const minorTicks = d3.range(500, 4001, 100).filter(v => v % 500 !== 0);

  g.append('g').attr('class', 'axis x-axis')
    .attr('transform', `translate(0,${plotH})`)
    .call(d3.axisBottom(x).tickSizeOuter(0).tickValues(majorTicks).tickSize(6));

  g.append('g').attr('class', 'axis x-axis minor')
    .attr('transform', `translate(0,${plotH})`)
    .call(d3.axisBottom(x).tickSizeOuter(0).tickValues(minorTicks).tickSize(3).tickFormat(''))
    .selectAll('text').remove();

  g.append('g').attr('class', 'axis y-axis')
    .call(d3.axisLeft(y).tickValues(yTicks).tickSizeOuter(0));

  // Axis labels
  g.append('text').attr('class', 'axis-label')
    .attr('x', plotW / 2).attr('y', plotH + 42)
    .attr('text-anchor', 'middle').text('Wavenumber (cm\u207B\u00B9)');

  g.append('text').attr('class', 'axis-label')
    .attr('x', -plotH / 2).attr('y', -42)
    .attr('text-anchor', 'middle').attr('transform', 'rotate(-90)')
    .text('Transmittance (%)');

  // Smooth and draw trace
  const avgSpacing = Math.abs(curve[0].wavenumber - curve[curve.length - 1].wavenumber) / curve.length;
  const smoothRadius = Math.max(2, Math.round(8 / avgSpacing));
  const smoothedCurve = gaussianSmooth(curve, tScale, smoothRadius);

  const line = d3.line()
    .x(d => x(d.wavenumber))
    .y(d => y(d.t))
    .curve(d3.curveMonotoneX);

  g.append('path')
    .datum(smoothedCurve)
    .attr('class', 'ir-trace')
    .attr('clip-path', `url(#${clipId})`)
    .attr('d', line);

  const sortedSmoothed = [...smoothedCurve].sort((a, b) => a.wavenumber - b.wavenumber);

  // Signal labels (study mode)
  if (show.signalLabels && Object.keys(labels).length > 0) {
    const labelEntries = Object.entries(labels).map(([key, info]) => {
      const tVal = interpolateSmoothed(sortedSmoothed, info.wavenumber);
      return { key, wn: info.wavenumber, tVal, assignment: info.assignment, xPx: x(info.wavenumber) };
    });
    labelEntries.sort((a, b) => a.xPx - b.xPx);

    // Collision resolution
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 1; i < labelEntries.length; i++) {
        const gap = 28 - (labelEntries[i].xPx - labelEntries[i - 1].xPx);
        if (gap > 0) {
          const nudge = Math.ceil(gap / 2);
          labelEntries[i - 1].xPx -= nudge;
          labelEntries[i].xPx += nudge;
        }
      }
    }

    const lg = g.append('g').attr('class', 'ir-labels');
    labelEntries.forEach(lbl => {
      const peakX = x(lbl.wn), peakY = y(lbl.tVal);
      lg.append('line').attr('class', 'label-marker')
        .attr('x1', lbl.xPx).attr('y1', 23).attr('x2', peakX).attr('y2', peakY - 4);
      lg.append('circle').attr('class', 'label-dot')
        .attr('cx', peakX).attr('cy', peakY).attr('r', 2.5);
      lg.append('text').attr('class', 'label-text')
        .attr('x', lbl.xPx).attr('y', 15).text(lbl.wn);
    });
  }

  // Highlight indicator for question mode
  if (highlightWn !== null) {
    const tVal = interpolateSmoothed(sortedSmoothed, highlightWn);
    const hx = x(highlightWn), hy = y(tVal);

    const hg = g.append('g').attr('class', 'ir-highlight');

    // Dashed drop line
    hg.append('line')
      .attr('x1', hx).attr('y1', 6)
      .attr('x2', hx).attr('y2', hy - 5)
      .attr('stroke', 'var(--highlight, #c0392b)')
      .attr('stroke-width', 1.2)
      .attr('stroke-dasharray', '4,3');

    // Dot on curve
    hg.append('circle')
      .attr('cx', hx).attr('cy', hy).attr('r', 4)
      .attr('fill', 'var(--highlight, #c0392b)');

    // Small triangle marker at top
    const tri = `M${hx - 5},0 L${hx + 5},0 L${hx},7 Z`;
    hg.append('path').attr('d', tri)
      .attr('fill', 'var(--highlight, #c0392b)');
  }

  // Title
  let title = 'IR Spectrum';
  if (show.name) title += ': ' + compound.name;
  const meta = [];
  if (show.formula && compound.formula) meta.push(compound.formula);
  if (show.mw && compound.molecular_weight) meta.push('MW ' + compound.molecular_weight);
  if (meta.length) title += ' (' + meta.join(', ') + ')';

  svg.append('text').attr('class', 'title-text')
    .attr('x', margin.left).attr('y', 24).text(title);

  // Crosshair tooltip
  const tooltipEl = document.createElement('div');
  tooltipEl.className = 'ir-tooltip';
  container.style.position = 'relative';
  container.appendChild(tooltipEl);

  const overlay = g.append('rect')
    .attr('width', plotW).attr('height', plotH)
    .attr('fill', 'transparent').attr('cursor', 'crosshair');

  const crossV = g.append('line').attr('class', 'crosshair').style('display', 'none');
  const crossH = g.append('line').attr('class', 'crosshair').style('display', 'none');

  overlay
    .on('mouseenter', () => { crossV.style('display', null); crossH.style('display', null); })
    .on('mousemove', function(event) {
      const [mx] = d3.pointer(event);
      const wn = x.invert(mx);
      const tVal = interpolateSmoothed(sortedSmoothed, wn);
      if (tVal === null) return;
      const cy = y(tVal);

      crossV.attr('x1', mx).attr('x2', mx).attr('y1', 0).attr('y2', plotH);
      crossH.attr('x1', 0).attr('x2', plotW).attr('y1', cy).attr('y2', cy);

      let html = `<strong>${Math.round(wn)} cm\u207B\u00B9</strong> &middot; ${tVal.toFixed(1)}% T`;
      if (show.tooltipLabels) {
        for (const [, info] of Object.entries(labels)) {
          if (Math.abs(info.wavenumber - wn) < 15) {
            html += `<br><em>${info.assignment}</em>`;
            break;
          }
        }
      }
      tooltipEl.innerHTML = html;
      tooltipEl.classList.add('visible');
      const rect = container.getBoundingClientRect();
      tooltipEl.style.left = (event.clientX - rect.left + 15) + 'px';
      tooltipEl.style.top = (event.clientY - rect.top - 10) + 'px';
    })
    .on('mouseleave', () => {
      crossV.style('display', 'none');
      crossH.style('display', 'none');
      tooltipEl.classList.remove('visible');
    });

  return { svg: svg.node(), smoothedCurve, x, y };
}
