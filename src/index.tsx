import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS for API requests
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Types for chemistry experiments
interface FlameTestResult {
  cation: string
  color: string
  wavelength: string
  description: string
}

interface QualitativeTestResult {
  cation: string
  reagent: string
  reaction: string
  color: string
  description: string
}

// Flame test data for Lab Experiment #3
const flameTestData: Record<string, FlameTestResult> = {
  'Li+': {
    cation: 'Li+',
    color: '#DC143C',
    wavelength: '670 нм',
    description: 'Ярко-красное окрашивание пламени'
  },
  'Na+': {
    cation: 'Na+',
    color: '#FFD700',
    wavelength: '589 нм',
    description: 'Ярко-желтое окрашивание пламени'
  },
  'K+': {
    cation: 'K+',
    color: '#8B00FF',
    wavelength: '766 нм',
    description: 'Фиолетовое окрашивание пламени'
  },
  'Ca2+': {
    cation: 'Ca2+',
    color: '#FF4500',
    wavelength: '622 нм',
    description: 'Оранжево-красное окрашивание пламени'
  },
  'Sr2+': {
    cation: 'Sr2+',
    color: '#FF0000',
    wavelength: '650 нм',
    description: 'Красное окрашивание пламени'
  },
  'Ba2+': {
    cation: 'Ba2+',
    color: '#90EE90',
    wavelength: '514 нм',
    description: 'Зеленое окрашивание пламени'
  },
  'Cu2+': {
    cation: 'Cu2+',
    color: '#00CED1',
    wavelength: '515 нм',
    description: 'Сине-зеленое окрашивание пламени'
  }
}

// Qualitative test data for Lab Experiment #4
const qualitativeTestData: Record<string, Record<string, QualitativeTestResult>> = {
  'Fe2+': {
    'K3[Fe(CN)6]': {
      cation: 'Fe2+',
      reagent: 'K₃[Fe(CN)₆] (гексацианоферрат(III) калия)',
      reaction: '3Fe²⁺ + 2[Fe(CN)₆]³⁻ → Fe₃[Fe(CN)₆]₂↓',
      color: '#000080',
      description: 'Темно-синий осадок (берлинская лазурь)'
    },
    'KSCN': {
      cation: 'Fe2+',
      reagent: 'KSCN (роданид калия)',
      reaction: 'Реакция не происходит',
      color: '#FFFFFF',
      description: 'Окрашивание отсутствует'
    }
  },
  'Fe3+': {
    'KSCN': {
      cation: 'Fe3+',
      reagent: 'KSCN (роданид калия)',
      reaction: 'Fe³⁺ + 3SCN⁻ → [Fe(SCN)₃]',
      color: '#8B0000',
      description: 'Интенсивно-красное окрашивание'
    },
    'K4[Fe(CN)6]': {
      cation: 'Fe3+',
      reagent: 'K₄[Fe(CN)₆] (гексацианоферрат(II) калия)',
      reaction: '4Fe³⁺ + 3[Fe(CN)₆]⁴⁻ → Fe₄[Fe(CN)₆]₃↓',
      color: '#000080',
      description: 'Темно-синий осадок (берлинская лазурь)'
    }
  },
  'Cu2+': {
    'NH4OH': {
      cation: 'Cu2+',
      reagent: 'NH₄OH (гидроксид аммония)',
      reaction: 'Cu²⁺ + 4NH₃ → [Cu(NH₃)₄]²⁺',
      color: '#4169E1',
      description: 'Ярко-синее окрашивание (аммиакат меди)'
    },
    'NaOH': {
      cation: 'Cu2+',
      reagent: 'NaOH (гидроксид натрия)',
      reaction: 'Cu²⁺ + 2OH⁻ → Cu(OH)₂↓',
      color: '#87CEEB',
      description: 'Голубой осадок гидроксида меди(II)'
    }
  }
}

// API Routes

// Get flame test data
app.get('/api/flame-test/:cation', (c) => {
  const cation = c.req.param('cation')
  const result = flameTestData[cation]
  
  if (!result) {
    return c.json({ error: 'Катион не найден' }, 404)
  }
  
  return c.json(result)
})

// Get qualitative test data
app.get('/api/qualitative-test/:cation/:reagent', (c) => {
  const cation = c.req.param('cation')
  const reagent = c.req.param('reagent')
  
  const cationTests = qualitativeTestData[cation]
  if (!cationTests) {
    return c.json({ error: 'Катион не найден' }, 404)
  }
  
  const result = cationTests[reagent]
  if (!result) {
    return c.json({ error: 'Реагент не найден для данного катиона' }, 404)
  }
  
  return c.json(result)
})

// Generate lab report
app.post('/api/generate-report', async (c) => {
  try {
    const reportData = await c.req.json()
    
    // Generate timestamp
    const timestamp = new Date().toLocaleString('ru-RU')
    
    // Format report
    const formattedReport = {
      ...reportData,
      generatedAt: timestamp,
      reportId: `LAB-${Date.now()}`
    }
    
    return c.json(formattedReport)
  } catch (error) {
    return c.json({ error: 'Ошибка при создании отчета' }, 500)
  }
})

// Main page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Виртуальная химическая лаборатория - 9 класс</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script>
            tailwind.config = {
                theme: {
                    extend: {
                        colors: {
                            'lab-blue': '#1e40af',
                            'lab-green': '#059669',
                            'flame-red': '#dc2626',
                            'flame-yellow': '#fbbf24',
                            'flame-violet': '#7c3aed'
                        }
                    }
                }
            }
        </script>
        <link href="/static/style.css" rel="stylesheet">
    </head>
    <body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <!-- Header -->
        <header class="bg-white shadow-lg border-b-4 border-lab-blue">
            <div class="max-w-7xl mx-auto px-4 py-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-flask text-4xl text-lab-blue"></i>
                        <div>
                            <h1 class="text-3xl font-bold text-gray-800">Виртуальная химическая лаборатория</h1>
                            <p class="text-lg text-gray-600">9 класс • Качественные реакции на катионы</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-gray-500">Соответствует учебной программе</p>
                        <p class="text-sm font-semibold text-lab-blue">9.4.1.8 - 9.4.1.9</p>
                    </div>
                </div>
            </div>
        </header>

        <!-- Navigation Tabs -->
        <nav class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4">
                <div class="flex space-x-8">
                    <button id="tab-info" class="tab-button active py-4 px-6 text-sm font-medium border-b-2 border-lab-blue text-lab-blue">
                        <i class="fas fa-info-circle mr-2"></i>Информация
                    </button>
                    <button id="tab-flame" class="tab-button py-4 px-6 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                        <i class="fas fa-fire mr-2"></i>Лаб. опыт №3
                    </button>
                    <button id="tab-qualitative" class="tab-button py-4 px-6 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                        <i class="fas fa-vials mr-2"></i>Лаб. опыт №4
                    </button>
                    <button id="tab-report" class="tab-button py-4 px-6 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                        <i class="fas fa-file-alt mr-2"></i>Протокол
                    </button>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 py-8">
            <!-- Information Tab -->
            <div id="content-info" class="tab-content">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Lab Experiment #3 Info -->
                    <div class="bg-white rounded-lg shadow-lg p-6">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <i class="fas fa-fire text-flame-red mr-3"></i>
                            Лабораторный опыт №3
                        </h2>
                        <h3 class="text-lg font-semibold text-gray-700 mb-3">
                            Определение катионов по окрашиванию пламени
                        </h3>
                        <div class="space-y-3 text-gray-600">
                            <p><strong>Цель:</strong> Изучить качественные реакции окрашивания пламени для определения катионов Li⁺, Na⁺, K⁺, Ca²⁺, Sr²⁺, Ba²⁺, Cu²⁺</p>
                            <p><strong>Принцип:</strong> При внесении соединений металлов в пламя, электроны в атомах переходят на более высокие энергетические уровни, а при возвращении излучают свет определенной длины волны.</p>
                            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                                <p class="text-sm"><i class="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
                                <strong>Компетенция 9.4.1.8:</strong> описывать и проводить реакции окрашивания цвета пламени для определения катионов металлов</p>
                            </div>
                        </div>
                    </div>

                    <!-- Lab Experiment #4 Info -->
                    <div class="bg-white rounded-lg shadow-lg p-6">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <i class="fas fa-vials text-lab-blue mr-3"></i>
                            Лабораторный опыт №4
                        </h2>
                        <h3 class="text-lg font-semibold text-gray-700 mb-3">
                            Качественные реакции на катионы Fe²⁺, Fe³⁺, Cu²⁺
                        </h3>
                        <div class="space-y-3 text-gray-600">
                            <p><strong>Цель:</strong> Провести качественные реакции для определения ионов железа(II), железа(III) и меди(II)</p>
                            <p><strong>Принцип:</strong> Использование специфических реагентов, которые дают характерные цветные реакции с определенными катионами.</p>
                            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
                                <p class="text-sm"><i class="fas fa-flask text-blue-600 mr-2"></i>
                                <strong>Компетенция 9.4.1.9:</strong> проводить качественные реакции на определение катионов Fe²⁺, Fe³⁺, Cu²⁺</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Safety Information -->
                <div class="mt-8 bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
                    <h3 class="text-lg font-semibold text-red-800 mb-3 flex items-center">
                        <i class="fas fa-shield-alt mr-2"></i>
                        Правила безопасности в виртуальной лаборатории
                    </h3>
                    <ul class="list-disc list-inside space-y-2 text-red-700">
                        <li>В реальной лаборатории всегда используйте защитные очки и перчатки</li>
                        <li>Работайте с реактивами только в вытяжном шкафу</li>
                        <li>Не пробуйте реактивы на вкус</li>
                        <li>При работе с пламенем соблюдайте осторожность</li>
                        <li>После работы тщательно мойте руки</li>
                    </ul>
                </div>
            </div>

            <!-- Flame Test Tab -->
            <div id="content-flame" class="tab-content hidden">
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <i class="fas fa-fire text-flame-red mr-3"></i>
                        Лабораторный опыт №3: Окрашивание пламени
                    </h2>
                    
                    <!-- Cation Selection -->
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-700 mb-3">Выберите катион для исследования:</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                            <button class="cation-btn bg-gradient-to-r from-red-400 to-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-red-500 hover:to-red-700 transition-all" data-cation="Li+">
                                Li⁺
                            </button>
                            <button class="cation-btn bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all" data-cation="Na+">
                                Na⁺
                            </button>
                            <button class="cation-btn bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-purple-700 transition-all" data-cation="K+">
                                K⁺
                            </button>
                            <button class="cation-btn bg-gradient-to-r from-orange-400 to-orange-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-orange-500 hover:to-orange-700 transition-all" data-cation="Ca2+">
                                Ca²⁺
                            </button>
                            <button class="cation-btn bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-800 transition-all" data-cation="Sr2+">
                                Sr²⁺
                            </button>
                            <button class="cation-btn bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-500 hover:to-green-700 transition-all" data-cation="Ba2+">
                                Ba²⁺
                            </button>
                            <button class="cation-btn bg-gradient-to-r from-cyan-400 to-cyan-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-cyan-500 hover:to-cyan-700 transition-all" data-cation="Cu2+">
                                Cu²⁺
                            </button>
                        </div>
                    </div>

                    <!-- Flame Simulation -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div class="text-center">
                            <h4 class="text-lg font-semibold text-gray-700 mb-4">Горелка Бунзена</h4>
                            <div class="relative mx-auto w-64 h-80 bg-gray-800 rounded-lg p-4" style="background: linear-gradient(to bottom, #4a5568, #2d3748);">
                                <!-- Burner base -->
                                <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-20 bg-gray-600 rounded-t-lg"></div>
                                <!-- Flame -->
                                <div id="flame" class="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-12 h-24 transition-all duration-1000 ease-in-out">
                                    <div class="flame-base w-full h-full bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent rounded-full opacity-80 animate-pulse"></div>
                                </div>
                                <!-- Platinum wire -->
                                <div class="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gray-300"></div>
                            </div>
                            <button id="ignite-btn" class="mt-4 bg-lab-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                <i class="fas fa-fire mr-2"></i>Поджечь горелку
                            </button>
                        </div>

                        <!-- Results Display -->
                        <div id="flame-results" class="hidden">
                            <h4 class="text-lg font-semibold text-gray-700 mb-4">Результаты эксперимента</h4>
                            <div class="bg-gray-50 rounded-lg p-6 space-y-4">
                                <div class="flex items-center space-x-3">
                                    <span class="font-semibold text-gray-700">Катион:</span>
                                    <span id="result-cation" class="text-lab-blue font-semibold"></span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <span class="font-semibold text-gray-700">Цвет пламени:</span>
                                    <div id="result-color-sample" class="w-8 h-8 rounded-full border-2 border-gray-300"></div>
                                    <span id="result-color-name" class="text-gray-600"></span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <span class="font-semibold text-gray-700">Длина волны:</span>
                                    <span id="result-wavelength" class="text-gray-600"></span>
                                </div>
                                <div class="mt-4">
                                    <span class="font-semibold text-gray-700">Наблюдение:</span>
                                    <p id="result-description" class="text-gray-600 mt-2"></p>
                                </div>
                                <button id="add-to-report-flame" class="w-full mt-4 bg-lab-green text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                                    <i class="fas fa-plus mr-2"></i>Добавить в протокол
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Qualitative Test Tab -->
            <div id="content-qualitative" class="tab-content hidden">
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <i class="fas fa-vials text-lab-blue mr-3"></i>
                        Лабораторный опыт №4: Качественные реакции
                    </h2>
                    
                    <!-- Test Selection -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Cation Selection -->
                        <div>
                            <h3 class="text-lg font-semibold text-gray-700 mb-3">1. Выберите катион:</h3>
                            <div class="space-y-2">
                                <button class="qual-cation-btn w-full text-left bg-gradient-to-r from-orange-400 to-orange-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-orange-500 hover:to-orange-700 transition-all" data-cation="Fe2+">
                                    Fe²⁺ (железо II)
                                </button>
                                <button class="qual-cation-btn w-full text-left bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-800 transition-all" data-cation="Fe3+">
                                    Fe³⁺ (железо III)
                                </button>
                                <button class="qual-cation-btn w-full text-left bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-500 hover:to-blue-700 transition-all" data-cation="Cu2+">
                                    Cu²⁺ (медь II)
                                </button>
                            </div>
                        </div>

                        <!-- Reagent Selection -->
                        <div>
                            <h3 class="text-lg font-semibold text-gray-700 mb-3">2. Выберите реагент:</h3>
                            <div id="reagent-selection" class="space-y-2">
                                <p class="text-gray-500 italic">Сначала выберите катион</p>
                            </div>
                        </div>
                    </div>

                    <!-- Test Tube Simulation -->
                    <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div class="text-center">
                            <h4 class="text-lg font-semibold text-gray-700 mb-4">Проведение реакции</h4>
                            <div class="relative mx-auto w-40 h-60">
                                <!-- Test tube -->
                                <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-48 bg-gradient-to-b from-gray-100 to-gray-200 rounded-b-full border-2 border-gray-300">
                                    <!-- Solution -->
                                    <div id="test-solution" class="absolute bottom-2 left-2 right-2 h-12 bg-blue-200 rounded-b-full transition-all duration-1000"></div>
                                </div>
                                <!-- Dropper -->
                                <div id="dropper" class="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-20 transition-all duration-500">
                                    <div class="w-2 h-16 bg-gray-600 mx-auto"></div>
                                    <div class="w-6 h-4 bg-gray-400 rounded-full mx-auto"></div>
                                </div>
                            </div>
                            <button id="conduct-test-btn" class="mt-4 bg-lab-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed" disabled>
                                <i class="fas fa-flask mr-2"></i>Провести реакцию
                            </button>
                        </div>

                        <!-- Test Results -->
                        <div id="qualitative-results" class="hidden">
                            <h4 class="text-lg font-semibold text-gray-700 mb-4">Результаты эксперимента</h4>
                            <div class="bg-gray-50 rounded-lg p-6 space-y-4">
                                <div class="flex items-center space-x-3">
                                    <span class="font-semibold text-gray-700">Катион:</span>
                                    <span id="qual-result-cation" class="text-lab-blue font-semibold"></span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <span class="font-semibold text-gray-700">Реагент:</span>
                                    <span id="qual-result-reagent" class="text-gray-600"></span>
                                </div>
                                <div class="mt-4">
                                    <span class="font-semibold text-gray-700">Химическая реакция:</span>
                                    <p id="qual-result-reaction" class="text-gray-600 mt-2 font-mono text-sm bg-white p-3 rounded border"></p>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <span class="font-semibold text-gray-700">Наблюдаемый цвет:</span>
                                    <div id="qual-result-color-sample" class="w-8 h-8 rounded-full border-2 border-gray-300"></div>
                                </div>
                                <div class="mt-4">
                                    <span class="font-semibold text-gray-700">Описание:</span>
                                    <p id="qual-result-description" class="text-gray-600 mt-2"></p>
                                </div>
                                <button id="add-to-report-qual" class="w-full mt-4 bg-lab-green text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                                    <i class="fas fa-plus mr-2"></i>Добавить в протокол
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Report Tab -->
            <div id="content-report" class="tab-content hidden">
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <i class="fas fa-file-alt text-lab-blue mr-3"></i>
                        Протокол лабораторной работы
                    </h2>
                    
                    <!-- Student Information -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">ФИО студента</label>
                            <input type="text" id="student-name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lab-blue focus:border-transparent" placeholder="Введите ваше ФИО">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Класс</label>
                            <input type="text" id="student-class" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lab-blue focus:border-transparent" value="9" placeholder="9">
                        </div>
                    </div>

                    <!-- Lab Work Header -->
                    <div class="mb-8 p-6 bg-blue-50 rounded-lg">
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">Лабораторная работа</h3>
                        <p class="text-lg text-gray-700 mb-2"><strong>Тема:</strong> Качественные реакции на катионы</p>
                        <p class="text-gray-600 mb-2"><strong>Цель:</strong> Изучить качественные реакции для определения катионов металлов методом окрашивания пламени и химических реакций</p>
                        <p class="text-gray-600"><strong>Дата проведения:</strong> <span id="report-date"></span></p>
                    </div>

                    <!-- Equipment -->
                    <div class="mb-8">
                        <h4 class="text-lg font-semibold text-gray-800 mb-3">Оборудование и реактивы</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h5 class="font-semibold text-gray-700 mb-2">Оборудование:</h5>
                                <ul class="list-disc list-inside text-gray-600 space-y-1">
                                    <li>Горелка Бунзена</li>
                                    <li>Платиновая петля</li>
                                    <li>Пробирки</li>
                                    <li>Пипетки</li>
                                </ul>
                            </div>
                            <div>
                                <h5 class="font-semibold text-gray-700 mb-2">Реактивы:</h5>
                                <ul class="list-disc list-inside text-gray-600 space-y-1">
                                    <li>Соли Li⁺, Na⁺, K⁺, Ca²⁺, Sr²⁺, Ba²⁺, Cu²⁺</li>
                                    <li>K₃[Fe(CN)₆], K₄[Fe(CN)₆]</li>
                                    <li>KSCN, NH₄OH, NaOH</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Experimental Results -->
                    <div class="mb-8">
                        <h4 class="text-lg font-semibold text-gray-800 mb-3">Ход работы и результаты</h4>
                        
                        <!-- Flame Test Results -->
                        <div class="mb-6">
                            <h5 class="font-semibold text-gray-700 mb-3">Лабораторный опыт №3: Окрашивание пламени</h5>
                            <div id="flame-test-results" class="space-y-2">
                                <p class="text-gray-500 italic">Результаты будут добавлены после проведения экспериментов</p>
                            </div>
                        </div>

                        <!-- Qualitative Test Results -->
                        <div class="mb-6">
                            <h5 class="font-semibold text-gray-700 mb-3">Лабораторный опыт №4: Качественные реакции</h5>
                            <div id="qualitative-test-results" class="space-y-2">
                                <p class="text-gray-500 italic">Результаты будут добавлены после проведения экспериментов</p>
                            </div>
                        </div>
                    </div>

                    <!-- Conclusion -->
                    <div class="mb-8">
                        <h4 class="text-lg font-semibold text-gray-800 mb-3">Вывод</h4>
                        <textarea id="conclusion" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lab-blue focus:border-transparent h-24" placeholder="Напишите вывод по проведенной работе..."></textarea>
                    </div>

                    <!-- Generate Report Button -->
                    <div class="text-center">
                        <button id="generate-report-btn" class="bg-lab-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                            <i class="fas fa-download mr-2"></i>Сформировать отчет
                        </button>
                    </div>
                </div>
            </div>
        </main>

        <!-- Scripts -->
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app