const API_BASE_URL = 'http://localhost:3000'

const cities = []
let chartData = null

const form = document.getElementById('birth-form')
const citySearchInput = document.getElementById('city-search')
const cityResults = document.getElementById('city-results')
const latitudeInput = document.getElementById('latitude')
const longitudeInput = document.getElementById('longitude')
const utcOffsetInput = document.getElementById('utc-offset')
const birthDateInput = document.getElementById('birth-date')
const birthTimeInput = document.getElementById('birth-time')
const houseSystemInput = document.getElementById('house-system')
const submitButton = document.getElementById('submit-btn')
const statusBox = document.getElementById('form-status')

const summaryGrid = document.getElementById('summary-grid')
const planetsContainer = document.getElementById('planets-container')
const axesContainer = document.getElementById('axes-container')
const housesContainer = document.getElementById('houses-container')
const aspectsContainer = document.getElementById('aspects-container')
const chartShell = document.getElementById('chart-shell')

const signNames = {
  1: 'Aries',
  2: 'Tauro',
  3: 'Géminis',
  4: 'Cáncer',
  5: 'Leo',
  6: 'Virgo',
  7: 'Libra',
  8: 'Escorpio',
  9: 'Sagitario',
  10: 'Capricornio',
  11: 'Acuario',
  12: 'Piscis'
}

const signSymbols = {
  1: '♈',
  2: '♉',
  3: '♊',
  4: '♋',
  5: '♌',
  6: '♍',
  7: '♎',
  8: '♏',
  9: '♐',
  10: '♑',
  11: '♒',
  12: '♓'
}

const signColors = {
  1: 'rgba(255, 120, 120, 0.22)',
  2: 'rgba(201, 171, 92, 0.22)',
  3: 'rgba(255, 214, 102, 0.18)',
  4: 'rgba(133, 198, 255, 0.18)',
  5: 'rgba(255, 162, 89, 0.20)',
  6: 'rgba(169, 214, 136, 0.18)',
  7: 'rgba(233, 168, 212, 0.18)',
  8: 'rgba(170, 118, 255, 0.18)',
  9: 'rgba(255, 174, 92, 0.18)',
  10: 'rgba(163, 179, 200, 0.18)',
  11: 'rgba(111, 199, 255, 0.18)',
  12: 'rgba(155, 138, 255, 0.18)'
}

const astroLabels = {
  sun: 'Sol',
  moon: 'Luna',
  mercury: 'Mercurio',
  venus: 'Venus',
  mars: 'Marte',
  jupiter: 'Júpiter',
  saturn: 'Saturno',
  uranus: 'Urano',
  neptune: 'Neptuno',
  pluto: 'Plutón',
  chiron: 'Quirón',
  lilith: 'Lilith',
  ceres: 'Ceres',
  vesta: 'Vesta',
  pallas: 'Palas',
  juno: 'Juno'
}

const astroSymbols = {
  sun: '☉',
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
  uranus: '♅',
  neptune: '♆',
  pluto: '♇',
  chiron: '⚷',
  lilith: '⚸',
  ceres: '⚳',
  vesta: '⚶',
  pallas: '⚴',
  juno: '⚵'
}

const axisLabels = {
  asc: 'Ascendente',
  dc: 'Descendente',
  mc: 'Medio Cielo',
  ic: 'Fondo del Cielo'
}

const axisSymbols = {
  asc: 'ASC',
  dc: 'DC',
  mc: 'MC',
  ic: 'IC'
}

const aspectLabels = {
  conjunction: 'Conjunción',
  semisextile: 'Semisextil',
  sextile: 'Sextil',
  quadrature: 'Cuadratura',
  trigone: 'Trígono',
  quincunx: 'Quincuncio',
  opposition: 'Oposición'
}

const aspectSymbols = {
  conjunction: '☌',
  semisextile: '⚺',
  sextile: '✶',
  quadrature: '□',
  trigone: '△',
  quincunx: '⚻',
  opposition: '☍'
}

const majorPlanetKeys = [
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto'
]

const setStatus = (message, type = '') => {
  statusBox.textContent = message
  statusBox.className = type ? `status status--${type}` : 'status'
}

const getSignName = (signNumber) => {
  return signNames[signNumber] || `Signo ${signNumber}`
}

const getSignSymbol = (signNumber) => {
  return signSymbols[signNumber] || '✦'
}

const getSignColor = (signNumber) => {
  return signColors[signNumber] || 'rgba(216, 181, 106, 0.15)'
}

const getAstroLabel = (name) => {
  return astroLabels[name] || name
}

const getAstroSymbol = (name) => {
  return astroSymbols[name] || '✦'
}

const getAxisLabel = (axisKey) => {
  return axisLabels[axisKey] || axisKey.toUpperCase()
}

const getAxisSymbol = (axisKey) => {
  return axisSymbols[axisKey] || '•'
}

const getAspectLabel = (aspectName) => {
  return aspectLabels[aspectName] || aspectName
}

const getAspectSymbol = (aspectName) => {
  return aspectSymbols[aspectName] || '•'
}

const formatPosition = (position) => {
  if (!position) {
    return 'Sin posición'
  }

  return `${position.degrees}° ${position.minutes}' ${position.seconds}"`
}

const clearCityResults = () => {
  cityResults.innerHTML = ''
  cityResults.style.display = 'none'
}

const renderCityResults = (matches) => {
  if (!matches.length) {
    cityResults.innerHTML = '<button type="button" class="city-result-item">No se encontraron coincidencias</button>'
    cityResults.style.display = 'block'
    return
  }

  cityResults.innerHTML = matches
    .map((city, index) => {
      return `
        <button
          type="button"
          class="city-result-item"
          data-city-index="${index}"
        >
          ${city.city}, ${city.country}
        </button>
      `
    })
    .join('')

  cityResults.style.display = 'block'

  const buttons = cityResults.querySelectorAll('.city-result-item')

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const cityIndex = Number(button.dataset.cityIndex)
      const selectedCity = matches[cityIndex]

      citySearchInput.value = `${selectedCity.city}, ${selectedCity.country}`
      latitudeInput.value = selectedCity.lat
      longitudeInput.value = selectedCity.lon
      utcOffsetInput.value = selectedCity.utc

      clearCityResults()
      setStatus('Ciudad seleccionada. Ya se completaron latitud, longitud y zona horaria.', 'success')
    })
  })
}

const searchCities = (query) => {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    clearCityResults()
    return
  }

  const matches = cities
    .filter((city) => {
      const cityText = `${city.city} ${city.country}`.toLowerCase()
      return cityText.includes(normalizedQuery)
    })
    .slice(0, 8)

  renderCityResults(matches)
}

const loadCities = async () => {
  try {
    const response = await fetch('cities.json')

    if (!response.ok) {
      throw new Error(`No se pudo cargar cities.json (${response.status})`)
    }

    const data = await response.json()

    cities.length = 0
    cities.push(...data)

    setStatus('Dataset local de ciudades cargado correctamente.', 'success')
  } catch (error) {
    console.error(error)
    setStatus(`No se pudo cargar el dataset local de ciudades: ${error.message}`, 'error')
  }
}

const renderSummary = (astros, axes) => {
  const sun = astros?.sun
  const moon = astros?.moon
  const asc = axes?.asc

  summaryGrid.innerHTML = `
    <div class="summary-item">
      <span class="summary-label">☉ Sol</span>
      <span class="summary-value">
        ${sun ? `${getSignSymbol(sun.sign)} ${getSignName(sun.sign)}` : 'Sin datos'}
      </span>
      <span class="summary-sub">
        ${sun ? `Grado ${formatPosition(sun.position)}` : ''}
      </span>
    </div>

    <div class="summary-item">
      <span class="summary-label">☽ Luna</span>
      <span class="summary-value">
        ${moon ? `${getSignSymbol(moon.sign)} ${getSignName(moon.sign)}` : 'Sin datos'}
      </span>
      <span class="summary-sub">
        ${moon ? `Grado ${formatPosition(moon.position)}` : ''}
      </span>
    </div>

    <div class="summary-item">
      <span class="summary-label">↑ Ascendente</span>
      <span class="summary-value">
        ${asc ? `${getSignSymbol(asc.sign)} ${getSignName(asc.sign)}` : 'Sin datos'}
      </span>
      <span class="summary-sub">
        ${asc ? `Grado ${formatPosition(asc.position)}` : ''}
      </span>
    </div>
  `
}

const renderPlanets = (astros) => {
  if (!astros || !Object.keys(astros).length) {
    planetsContainer.innerHTML = '<p class="empty-state">No se encontraron astros.</p>'
    return
  }

  const html = Object.values(astros)
    .map((astro) => {
      return `
        <div class="planet-card">
          <div class="headline">
            <span class="symbol">${getAstroSymbol(astro.name)}</span>
            <div class="planet-name">${getAstroLabel(astro.name)}</div>
          </div>

          <div class="primary-line">
            ${getSignSymbol(astro.sign)} ${getSignName(astro.sign)}
          </div>

          <div class="secondary-line">
            Grado exacto: ${formatPosition(astro.position)}
          </div>

          <div class="secondary-line">
            Movimiento retrógrado: ${astro.retrograde ? 'Sí' : 'No'}
          </div>

          <details>
            <summary>Ver datos técnicos</summary>
            <div class="tech-data">
              <div><strong>Longitud eclíptica:</strong> ${astro.position.longitude.toFixed(6)}</div>
              <div><strong>Velocidad:</strong> ${astro.speed.toFixed(6)}</div>
              <div><strong>Tipo técnico:</strong> ${astro.type}</div>
            </div>
          </details>
        </div>
      `
    })
    .join('')

  planetsContainer.innerHTML = `<div class="data-grid">${html}</div>`
}

const renderAxes = (axes) => {
  if (!axes || !Object.keys(axes).length) {
    axesContainer.innerHTML = '<p class="empty-state">No se encontraron ejes.</p>'
    return
  }

  const order = ['asc', 'dc', 'mc', 'ic']

  const html = order
    .map((axisKey) => {
      const axis = axes[axisKey]

      if (!axis || !axis.position) {
        return `
          <div class="axis-card">
            <div class="headline">
              <span class="symbol">${getAxisSymbol(axisKey)}</span>
              <div class="axis-name">${getAxisLabel(axisKey)}</div>
            </div>
            <div class="secondary-line">Sin datos.</div>
          </div>
        `
      }

      return `
        <div class="axis-card">
          <div class="headline">
            <span class="symbol">${getAxisSymbol(axisKey)}</span>
            <div class="axis-name">${getAxisLabel(axisKey)}</div>
          </div>

          <div class="primary-line">
            ${getSignSymbol(axis.sign)} ${getSignName(axis.sign)}
          </div>

          <div class="secondary-line">
            Grado exacto: ${formatPosition(axis.position)}
          </div>

          <details>
            <summary>Ver datos técnicos</summary>
            <div class="tech-data">
              <div><strong>Longitud eclíptica:</strong> ${axis.position.longitude.toFixed(6)}</div>
            </div>
          </details>
        </div>
      `
    })
    .join('')

  axesContainer.innerHTML = `<div class="data-grid">${html}</div>`
}

const renderHouses = (houses) => {
  if (!houses || !houses.length) {
    housesContainer.innerHTML = '<p class="empty-state">No se encontraron casas.</p>'
    return
  }

  const html = houses
    .map((house, index) => {
      return `
        <div class="house-card">
          <div class="headline">
            <span class="symbol">${index + 1}</span>
            <div class="house-name">Casa ${index + 1}</div>
          </div>

          <div class="primary-line">
            ${getSignSymbol(house.sign)} ${getSignName(house.sign)}
          </div>

          <div class="secondary-line">
            Comienza en: ${formatPosition(house.position)}
          </div>

          <details>
            <summary>Ver datos técnicos</summary>
            <div class="tech-data">
              <div><strong>Longitud eclíptica:</strong> ${house.position.longitude.toFixed(6)}</div>
            </div>
          </details>
        </div>
      `
    })
    .join('')

  housesContainer.innerHTML = `<div class="houses-grid">${html}</div>`
}

const renderAspects = (aspects) => {
  if (!aspects || !Object.keys(aspects).length) {
    aspectsContainer.innerHTML = '<p class="empty-state">No se encontraron aspectos.</p>'
    return
  }

  const cards = []

  Object.entries(aspects).forEach(([ownerName, aspectList]) => {
    if (!Array.isArray(aspectList) || !aspectList.length) {
      return
    }

    aspectList.forEach((aspect) => {
      const secondName = aspect.second?.name || 'desconocido'

      cards.push(`
        <div class="aspect-card">
          <div class="headline">
            <span class="symbol">${getAspectSymbol(aspect.name)}</span>
            <div class="aspect-name">${getAspectLabel(aspect.name)}</div>
          </div>

          <div class="primary-line">
            ${getAstroLabel(ownerName)} – ${getAstroLabel(secondName)}
          </div>

          <div class="secondary-line">
            Relación: ${getAspectLabel(aspect.name)}
          </div>

          <div class="secondary-line">
            Dirección: ${aspect.direction === 'bidirectional' ? 'Bidireccional' : 'Unidireccional'}
          </div>

          <details>
            <summary>Ver datos técnicos</summary>
            <div class="tech-data">
              <div><strong>Primer astro válido:</strong> ${aspect.first?.exist ? 'Sí' : 'No'}</div>
              <div><strong>Segundo astro válido:</strong> ${aspect.second?.exist ? 'Sí' : 'No'}</div>
              <div><strong>Dirección original:</strong> ${aspect.direction}</div>
              <div><strong>Aspecto original:</strong> ${aspect.name}</div>
            </div>
          </details>
        </div>
      `)
    })
  })

  if (!cards.length) {
    aspectsContainer.innerHTML = '<p class="empty-state">No se encontraron aspectos activos en esta carta.</p>'
    return
  }

  aspectsContainer.innerHTML = `<div class="aspects-grid">${cards.join('')}</div>`
}

const createSvgElement = (tagName, attributes = {}) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tagName)

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })

  return element
}

const appendSvgTitle = (element, text) => {
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'title')
  title.textContent = text
  element.appendChild(title)
}

const drawAspectLines = (svg, data, rotationOffset, cx, cy, innerCircleRadius) => {
  if (!data || !data.aspects || !data.astros) return
  const wheelAspectBodies = [
    'sun',
    'moon',
    'mercury',
    'venus',
    'mars',
    'jupiter',
    'saturn',
    'uranus',
    'neptune',
    'pluto',
    'chiron'
  ]

  // include quincunx and semisextile; conjunctions drawn but softer
  const visibleWheelAspects = new Set([
    'conjunction',
    'semisextile',
    'sextile',
    'quadrature',
    'trigone',
    'quincunx',
    'opposition'
  ])

  const aspectStrokeStyles = {
    conjunction: { stroke: 'rgba(244, 241, 232, 0.20)', width: 1.0 },
    semisextile: { stroke: 'rgba(200, 200, 255, 0.16)', width: 0.9 },
    sextile: { stroke: 'rgba(111, 199, 255, 0.34)', width: 1.1 },
    quadrature: { stroke: 'rgba(255, 124, 124, 0.34)', width: 1.15 },
    trigone: { stroke: 'rgba(125, 224, 180, 0.34)', width: 1.1 },
    quincunx: { stroke: 'rgba(210, 180, 255, 0.18)', width: 0.95 },
    opposition: { stroke: 'rgba(255, 198, 112, 0.34)', width: 1.15 }
  }

  // push aspect lines a bit outward so they don't compress at the very center
  const aspectRadius = innerCircleRadius + 78

  const seen = new Set()

  Object.entries(data.aspects).forEach(([ownerName, aspectList]) => {
    if (!Array.isArray(aspectList)) return

    aspectList.forEach((aspect) => {
      if (!aspect || !visibleWheelAspects.has(aspect.name)) return

      const firstName = aspect.first?.name || ownerName
      const secondName = aspect.second?.name || (aspect.second && aspect.second.name) || null

      if (!firstName || !secondName) return

      // Only draw if both bodies are in wheelAspectBodies
      if (!wheelAspectBodies.includes(firstName) || !wheelAspectBodies.includes(secondName)) return

      const pair = [firstName, secondName].sort().join('|')
      const uniqueKey = `${aspect.name}|${pair}`

      if (seen.has(uniqueKey)) return
      seen.add(uniqueKey)

      const aBody = data.astros[firstName]
      const bBody = data.astros[secondName]

      if (!aBody || !bBody || !aBody.position || !bBody.position) return

      const angleA = normalizeAngle(aBody.position.longitude + rotationOffset)
      const angleB = normalizeAngle(bBody.position.longitude + rotationOffset)

      const pointA = polarToCartesian(cx, cy, aspectRadius, angleA)
      const pointB = polarToCartesian(cx, cy, aspectRadius, angleB)

      const style = aspectStrokeStyles[aspect.name] || { stroke: 'rgba(244,241,232,0.20)', width: 1.0 }

      const line = createSvgElement('line', {
        x1: pointA.x,
        y1: pointA.y,
        x2: pointB.x,
        y2: pointB.y,
        stroke: style.stroke,
        'stroke-width': String(style.width),
        'stroke-linecap': 'round',
        opacity: String(style.opacity || 1)
      })

      // native tooltip for accessibility
      appendSvgTitle(line, `${getAspectLabel(aspect.name)}: ${getAstroLabel(firstName)} – ${getAstroLabel(secondName)}`)
      svg.appendChild(line)
    })
  })
}

const polarToCartesian = (cx, cy, radius, angleDeg) => {
  const radians = (angleDeg - 90) * (Math.PI / 180)

  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians)
  }
}

const createArcPath = (cx, cy, innerRadius, outerRadius, startAngle, endAngle) => {
  const p1 = polarToCartesian(cx, cy, outerRadius, startAngle)
  const p2 = polarToCartesian(cx, cy, outerRadius, endAngle)
  const p3 = polarToCartesian(cx, cy, innerRadius, endAngle)
  const p4 = polarToCartesian(cx, cy, innerRadius, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1

  return [
    `M ${p1.x} ${p1.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
    'Z'
  ].join(' ')
}

const normalizeAngle = (angle) => {
  let normalized = angle % 360

  if (normalized < 0) {
    normalized += 360
  }

  return normalized
}

const getPlanetVisualStyle = (key) => {
  if (key === 'sun') {
    return {
      fill: 'rgba(232, 191, 98, 0.95)',
      stroke: 'rgba(255, 229, 170, 0.95)',
      text: '#fff7df',
      size: 12,
      ring: 0
    }
  }

  if (key === 'moon') {
    return {
      fill: 'rgba(229, 208, 165, 0.96)',
      stroke: 'rgba(255, 243, 216, 0.98)',
      text: '#fffef8',
      size: 11,
      ring: 0
    }
  }

  if (majorPlanetKeys.includes(key)) {
    return {
      fill: 'rgba(104, 142, 210, 0.92)',
      stroke: 'rgba(188, 210, 255, 0.90)',
      text: '#f4f8ff',
      size: 10,
      ring: 1
    }
  }

  return {
    fill: 'rgba(146, 118, 208, 0.90)',
    stroke: 'rgba(216, 193, 255, 0.90)',
    text: '#faf6ff',
    size: 9,
    ring: 2
  }
}

const buildBodiesForChart = (astros, rotationOffset) => {
  const bodies = Object.entries(astros)
    .map(([key, astro]) => {
      const adjustedAngle = normalizeAngle(astro.position.longitude + rotationOffset)

      return {
        key,
        label: getAstroLabel(key),
        symbol: getAstroSymbol(key),
        longitude: astro.position.longitude,
        adjustedAngle,
        style: getPlanetVisualStyle(key)
      }
    })
    .sort((a, b) => a.adjustedAngle - b.adjustedAngle)

  const collisionThreshold = 12

  // assign cluster levels based on angular proximity, preserving order
  bodies.forEach((body, index) => {
    let clusterLevel = 0

    if (index > 0) {
      const previous = bodies[index - 1]
      const rawDiff = Math.abs(body.adjustedAngle - previous.adjustedAngle)
      const diff = Math.min(rawDiff, 360 - rawDiff) // shortest angular distance

      if (diff < collisionThreshold) {
        // close to previous, increase cluster level relative to previous
        clusterLevel = (previous.clusterLevel || 0) + 1
      } else {
        // separated enough: start new cluster (level 0)
        clusterLevel = 0
      }
    }

    body.clusterLevel = clusterLevel
  })

  return bodies
}

const drawAxisLine = (svg, cx, cy, innerRadius, outerRadius, angle, label, options = {}) => {
  const start = polarToCartesian(cx, cy, innerRadius, angle)
  const end = polarToCartesian(cx, cy, outerRadius, angle)

  const line = createSvgElement('line', {
    x1: start.x,
    y1: start.y,
    x2: end.x,
    y2: end.y,
    stroke: options.stroke || 'rgba(216, 181, 106, 0.55)',
    'stroke-width': options.width || '1.4'
  })

  svg.appendChild(line)

  const marker = polarToCartesian(cx, cy, outerRadius - 4, angle)
  const dot = createSvgElement('circle', {
    cx: marker.x,
    cy: marker.y,
    r: options.dotRadius || '3.5',
    fill: options.dotFill || 'rgba(216, 181, 106, 0.9)'
  })

  svg.appendChild(dot)

  const labelRadius = options.labelRadius || outerRadius - 24
  const labelAngle = angle + (options.labelAngleOffset || 0)
  const labelPos = polarToCartesian(cx, cy, labelRadius, labelAngle)

  const text = createSvgElement('text', {
    x: labelPos.x,
    y: labelPos.y,
    dy: '0.35em',
    fill: options.textFill || '#f4f1e8',
    'font-size': options.fontSize || '15',
    'font-weight': options.fontWeight || '700',
    'text-anchor': 'middle'
  })

  text.textContent = label
  svg.appendChild(text)
}

const drawChartShell = (data) => {
  if (!chartShell) return

  if (!data || !data.astros || !data.axes || !data.axes.asc) {
    chartShell.innerHTML = `
      <div class="chart-ring chart-ring-outer"></div>
      <div class="chart-ring chart-ring-middle"></div>
      <div class="chart-ring chart-ring-inner"></div>
      <div class="chart-center-text">Chart will appear here</div>
    `
    return
  }

  const size = 560
  const cx = size / 2
  const cy = size / 2
  const outerRadius = 252
  const zodiacOuterRadius = 222
  const zodiacInnerRadius = 178
  const innerCircleRadius = 52
  const signSymbolRadius = 194

  const axisOuterRadius = zodiacOuterRadius + 10
  const axisInnerRadius = innerCircleRadius
  const planetBaseRadius = 146

  const svg = createSvgElement('svg', {
    viewBox: `0 0 ${size} ${size}`,
    class: 'chart-svg',
    role: 'img',
    'aria-label': 'Vista previa de la carta natal'
  })

  appendSvgTitle(svg, 'Carta natal — vista previa')

  const defs = createSvgElement('defs')

  const glowFilter = createSvgElement('filter', {
    id: 'planetGlow',
    x: '-60%',
    y: '-60%',
    width: '220%',
    height: '220%'
  })

  const blur = createSvgElement('feGaussianBlur', {
    stdDeviation: '4',
    result: 'blur'
  })

  const merge = createSvgElement('feMerge')
  const mergeNode1 = createSvgElement('feMergeNode', { in: 'blur' })
  const mergeNode2 = createSvgElement('feMergeNode', { in: 'SourceGraphic' })

  merge.appendChild(mergeNode1)
  merge.appendChild(mergeNode2)
  glowFilter.appendChild(blur)
  glowFilter.appendChild(merge)
  defs.appendChild(glowFilter)
  svg.appendChild(defs)

  const outerHaloRadius = 252

  const decorativeOuterCircle = createSvgElement('circle', {
    cx,
    cy,
    r: outerHaloRadius,
    fill: 'none',
    stroke: 'rgba(216,181,106,0.15)',
    'stroke-width': '1',
    class: 'chart-decor'
  })

  const baseOuterCircle = createSvgElement('circle', {
    cx,
    cy,
    r: outerRadius,
    fill: 'none',
    stroke: 'rgba(216, 181, 106, 0.95)',
    'stroke-width': '2.8',
    class: 'chart-decor'
  })

  const zodiacOuterCircle = createSvgElement('circle', {
    cx,
    cy,
    r: zodiacOuterRadius,
    fill: 'none',
    stroke: 'rgba(216,181,106,0.30)',
    'stroke-width': '1.2',
    class: 'chart-decor'
  })

  const zodiacInnerCircle = createSvgElement('circle', {
    cx,
    cy,
    r: zodiacInnerRadius,
    fill: 'none',
    stroke: 'rgba(216,181,106,0.12)',
    'stroke-width': '1',
    class: 'chart-decor'
  })

  const planetTrackCircle = createSvgElement('circle', {
    cx,
    cy,
    r: planetBaseRadius,
    fill: 'none',
    stroke: 'rgba(216, 181, 106, 0.08)',
    'stroke-width': '1',
    class: 'chart-decor'
  })

  const coreCircle = createSvgElement('circle', {
    cx,
    cy,
    r: innerCircleRadius,
    fill: 'rgba(8, 14, 26, 0.90)',
    stroke: 'rgba(216, 181, 106, 0.10)',
    'stroke-width': '1',
    class: 'chart-core'
  })

  svg.appendChild(decorativeOuterCircle)
  svg.appendChild(baseOuterCircle)
  svg.appendChild(zodiacOuterCircle)
  svg.appendChild(zodiacInnerCircle)
  svg.appendChild(planetTrackCircle)
  svg.appendChild(coreCircle)

  const ascLongitude = data.axes.asc.position.longitude
  const rotationOffset = 270 - ascLongitude

  // Draw house lines and labels (using data.houses)
  if (Array.isArray(data.houses) && data.houses.length >= 12) {
    const houseAngles = data.houses.map((house) => normalizeAngle(house.position.longitude + rotationOffset))

    // subtle house lines (draw before axes so ASC/MC/etc remain visually dominant)
    houseAngles.forEach((angle, idx) => {
      const end = polarToCartesian(cx, cy, zodiacInnerRadius, angle)

      const houseLine = createSvgElement('line', {
        x1: cx,
        y1: cy,
        x2: end.x,
        y2: end.y,
        stroke: 'rgba(216,181,106,0.16)',
        'stroke-width': '0.9'
      })

      svg.appendChild(houseLine)
    })

    // place house numbers between each cusp
    const labelRadius = (zodiacInnerRadius + innerCircleRadius) / 2

    for (let i = 0; i < houseAngles.length; i += 1) {
      const a = houseAngles[i]
      const b = houseAngles[(i + 1) % houseAngles.length]
      const diff = (b - a + 360) % 360
      const mid = normalizeAngle(a + diff / 2)

      const pos = polarToCartesian(cx, cy, labelRadius, mid)

      const num = createSvgElement('text', {
        x: pos.x,
        y: pos.y,
        dy: '0.35em',
        fill: 'rgba(244,241,232,0.65)',
        'font-size': '11',
        'font-weight': '600',
        'text-anchor': 'middle'
      })

      num.textContent = String(i + 1)
      svg.appendChild(num)
    }
  }

  for (let i = 0; i < 12; i += 1) {
    const signIndex = i + 1
    const zodiacStart = i * 30
    const zodiacEnd = zodiacStart + 30

    const startAngle = zodiacStart + rotationOffset
    const endAngle = zodiacEnd + rotationOffset

    const segment = createSvgElement('path', {
      d: createArcPath(cx, cy, zodiacInnerRadius, zodiacOuterRadius, startAngle, endAngle),
      fill: getSignColor(signIndex),
      stroke: 'rgba(216, 181, 106, 0.08)',
      'stroke-width': '0.8'
    })

    svg.appendChild(segment)

    const lineStart = polarToCartesian(cx, cy, zodiacInnerRadius, startAngle)
    const lineEnd = polarToCartesian(cx, cy, outerRadius, startAngle)

    const line = createSvgElement('line', {
      x1: lineStart.x,
      y1: lineStart.y,
      x2: lineEnd.x,
      y2: lineEnd.y,
      stroke: 'rgba(216, 181, 106, 0.16)',
      'stroke-width': '1'
    })

    svg.appendChild(line)

    const signAngle = zodiacStart + 15 + rotationOffset
    const signPos = polarToCartesian(cx, cy, signSymbolRadius, signAngle)

    const text = createSvgElement('text', {
      x: signPos.x,
      y: signPos.y,
      dy: '0.35em',
      fill: '#d8b56a',
      'font-size': '22',
      'font-weight': '700',
      'text-anchor': 'middle'
    })

    text.textContent = getSignSymbol(signIndex)
    appendSvgTitle(text, `${getSignName(signIndex)} (${getSignSymbol(signIndex)})`)
    svg.appendChild(text)
  }

  const axisAngles = {
    asc: normalizeAngle(data.axes.asc.position.longitude + rotationOffset),
    dc: normalizeAngle(data.axes.dc.position.longitude + rotationOffset),
    mc: normalizeAngle(data.axes.mc.position.longitude + rotationOffset),
    ic: normalizeAngle(data.axes.ic.position.longitude + rotationOffset)
  }

  drawAxisLine(svg, cx, cy, axisInnerRadius, axisOuterRadius, axisAngles.asc, 'ASC', {
    stroke: 'rgba(216, 181, 106, 0.95)',
    width: '2',
    textFill: '#f4f1e8',
    labelRadius: 150,
    labelAngleOffset: -7,
    dotFill: 'rgba(216, 181, 106, 0.95)'
  })

  drawAxisLine(svg, cx, cy, axisInnerRadius + 10, axisOuterRadius - 10, axisAngles.dc, 'DC', {
    stroke: 'rgba(216, 181, 106, 0.38)',
    width: '1.2',
    textFill: 'rgba(244, 241, 232, 0.72)',
    labelRadius: 148,
    labelAngleOffset: 8,
    dotFill: 'rgba(216, 181, 106, 0.55)',
    fontSize: '13',
    fontWeight: '700',
    dotRadius: '2.6'
  })

  drawAxisLine(svg, cx, cy, axisInnerRadius + 12, axisOuterRadius - 10, axisAngles.mc, 'MC', {
    stroke: 'rgba(216, 181, 106, 0.38)',
    width: '1.2',
    textFill: 'rgba(244, 241, 232, 0.72)',
    labelRadius: 150,
    labelAngleOffset: -10,
    dotFill: 'rgba(216, 181, 106, 0.55)',
    fontSize: '13',
    fontWeight: '700',
    dotRadius: '2.6'
  })

  drawAxisLine(svg, cx, cy, axisInnerRadius + 12, axisOuterRadius - 10, axisAngles.ic, 'IC', {
    stroke: 'rgba(216, 181, 106, 0.38)',
    width: '1.2',
    textFill: 'rgba(244, 241, 232, 0.72)',
    labelRadius: 148,
    labelAngleOffset: 10,
    dotFill: 'rgba(216, 181, 106, 0.55)',
    fontSize: '13',
    fontWeight: '700',
    dotRadius: '2.6'
  })

  // draw aspect lines inside the central area before rendering planets
  drawAspectLines(svg, data, rotationOffset, cx, cy, innerCircleRadius)

  const bodies = buildBodiesForChart(data.astros, rotationOffset)

  bodies.forEach((body) => {
    const ringOffset = body.style.ring * 14
    const clusterOffset = body.clusterLevel * 16
    const radius = planetBaseRadius - ringOffset - clusterOffset
    const angle = body.adjustedAngle

    const pos = polarToCartesian(cx, cy, radius, angle)

    const glow = createSvgElement('circle', {
      cx: pos.x,
      cy: pos.y,
      r: body.style.size + 3,
      fill: body.style.fill,
      opacity: '0.16',
      filter: 'url(#planetGlow)'
    })

    const dot = createSvgElement('circle', {
      cx: pos.x,
      cy: pos.y,
      r: body.style.size,
      fill: body.style.fill,
      stroke: body.style.stroke,
      'stroke-width': '1.3'
    })

    const symbol = createSvgElement('text', {
      x: pos.x,
      y: pos.y,
      dy: '0.35em',
      fill: body.style.text,
      'font-size': body.key === 'sun' || body.key === 'moon' ? '18' : '14',
      'font-weight': '700',
      'text-anchor': 'middle'
    })

    symbol.textContent = body.symbol
    appendSvgTitle(symbol, `${body.label} — ${body.longitude.toFixed(4)}°`)

    svg.appendChild(glow)
    svg.appendChild(dot)
    svg.appendChild(symbol)

    if (body.key === 'sun' || body.key === 'moon') {
      const labelPos = polarToCartesian(cx, cy, radius + 32, angle)
      const label = createSvgElement('text', {
        x: labelPos.x,
        y: labelPos.y,
        dy: '0.35em',
        fill: 'rgba(244, 241, 232, 0.92)',
        'font-size': '12',
        'font-weight': '500',
        'text-anchor': 'middle'
      })

      label.textContent = body.label
      appendSvgTitle(label, `${body.label} — ${body.longitude.toFixed(4)}°`)
      svg.appendChild(label)
    }
  })

  chartShell.innerHTML = ''
  chartShell.appendChild(svg)
}

const clearResults = () => {
  chartData = null

  summaryGrid.innerHTML = `
    <div class="summary-item">
      <span class="summary-label">☉ Sol</span>
      <span class="summary-value">Pendiente</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">☽ Luna</span>
      <span class="summary-value">Pendiente</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">↑ Ascendente</span>
      <span class="summary-value">Pendiente</span>
    </div>
  `

  planetsContainer.innerHTML = '<p class="placeholder">Aquí mostraremos los astros devueltos por la API.</p>'
  axesContainer.innerHTML = '<p class="placeholder">Aquí mostraremos los ejes principales.</p>'
  housesContainer.innerHTML = '<p class="placeholder">Aquí mostraremos las 12 casas astrológicas.</p>'
  aspectsContainer.innerHTML = '<p class="placeholder">Aquí mostraremos los aspectos encontrados entre los astros.</p>'

  drawChartShell(null)
}

const fetchHoroscope = async (params) => {
  const query = new URLSearchParams(params)
  const url = `${API_BASE_URL}/horoscope?${query.toString()}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`La API respondió con estado ${response.status}`)
  }

  return response.json()
}

citySearchInput.addEventListener('input', (event) => {
  searchCities(event.target.value)
})

// Print-friendly export: use native print dialog for a clean document
const downloadPdf = () => {
  const source = document.getElementById('pdf-content')
  if (!source) return

  // Clone the content so we don't modify the live DOM
  const clone = source.cloneNode(true)

  // Expand details and remove summaries for print clarity
  clone.querySelectorAll('details').forEach((details) => {
    const summary = details.querySelector('summary')
    if (summary) summary.remove()
    details.setAttribute('open', 'open')
  })

  // Inline print CSS for the new window
  const printStyles = `
    body { font-family: Arial, sans-serif; background: #ffffff; color: #111111; margin: 0; padding: 24px; }
    * { box-sizing: border-box; color: #111111 !important; background: transparent !important; box-shadow: none !important; text-shadow: none !important; filter: none !important; }
    .card, .results-card, .summary-item, .planet-card, .axis-card, .house-card, .aspect-card { border: 1px solid #d8d8d8 !important; border-radius: 8px; padding: 12px; margin-bottom: 12px; break-inside: avoid; page-break-inside: avoid; }
    .summary-grid, .data-grid, .houses-grid, .aspects-grid { display: block !important; }
    .summary-item, .planet-card, .axis-card, .house-card, .aspect-card { display: block !important; }
    .chart-shell { width: 100% !important; height: auto !important; min-height: 0 !important; overflow: visible !important; border: 0 !important; margin: 0 auto 20px auto; page-break-inside: avoid; }
    .chart-svg { width: 100% !important; max-width: 700px !important; height: auto !important; display: block; margin: 0 auto; }
    summary { display: none !important; }
    details { display: block !important; margin-top: 8px; }
    details .tech-data { display: block !important; }
    h1, h2, h3 { color: #111111 !important; }
    .section-text, .block-description, .placeholder, .empty-state, .secondary-line, .summary-sub { color: #333333 !important; }
    .chart-actions, .whatsapp-button, .faq-section, .app-footer, .hero, .form-card, .background-stars { display: none !important; }
    @page { size: A4; margin: 12mm; }
  `

  // Create new window and write a minimal HTML document
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('No se pudo abrir la ventana de impresión. Permite ventanas emergentes en el navegador.')
    return
  }

  printWindow.document.open()
  printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>My Astrology App PDF</title><style>${printStyles}</style></head><body>${clone.innerHTML}</body></html>`)
  printWindow.document.close()
  printWindow.focus()

  // Wait briefly to allow resources (SVG/images) to render, then trigger print
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 700)
}

document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'download-pdf') {
    downloadPdf()
  }
})

document.addEventListener('click', (event) => {
  const clickedInsideSearch =
    citySearchInput.contains(event.target) ||
    cityResults.contains(event.target)

  if (!clickedInsideSearch) {
    clearCityResults()
  }
})

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const birthDate = birthDateInput.value.trim()
  const birthTime = birthTimeInput.value.trim()
  const utcOffset = utcOffsetInput.value.trim()
  const latitude = latitudeInput.value.trim()
  const longitude = longitudeInput.value.trim()
  const houseSystem = houseSystemInput.value.trim()

  if (!birthDate || !birthTime || !utcOffset || !latitude || !longitude || !houseSystem) {
    setStatus('Faltan campos por completar.', 'error')
    return
  }

  const utcOffsetPattern = /^[+-][0-9]{2}:[0-9]{2}$/

  if (!utcOffsetPattern.test(utcOffset)) {
    setStatus('La zona horaria debe tener formato como -05:00 o +01:00.', 'error')
    return
  }

  const isoTime = `${birthDate}T${birthTime}:00${utcOffset}`

  submitButton.disabled = true
  setStatus('Consultando la API y calculando la carta...', 'loading')

  try {
    const payload = await fetchHoroscope({
      time: isoTime,
      latitude,
      longitude,
      houseSystem
    })

    chartData = payload?.data

    if (!chartData) {
      throw new Error('La respuesta no contiene data.')
    }

    renderSummary(chartData.astros, chartData.axes)
    renderPlanets(chartData.astros)
    renderAxes(chartData.axes)
    renderHouses(chartData.houses)
    renderAspects(chartData.aspects)
    drawChartShell(chartData)

    setStatus('Carta calculada correctamente.', 'success')
  } catch (error) {
    console.error(error)
    setStatus(`Error al consultar la API: ${error.message}`, 'error')
  } finally {
    submitButton.disabled = false
  }
})

form.addEventListener('reset', () => {
  setTimeout(() => {
    clearCityResults()
    clearResults()
    setStatus('Completa los campos para consultar la API.')
  }, 0)
})

clearResults()
loadCities()
