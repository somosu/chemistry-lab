// Global variables
let selectedCation = null;
let selectedReagent = null;
let flameTestResults = [];
let qualitativeTestResults = [];

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const flame = document.getElementById('flame');
const igniteBtn = document.getElementById('ignite-btn');
const flameResults = document.getElementById('flame-results');
const qualitativeResults = document.getElementById('qualitative-results');
const testSolution = document.getElementById('test-solution');
const dropper = document.getElementById('dropper');
const conductTestBtn = document.getElementById('conduct-test-btn');
const reportDate = document.getElementById('report-date');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeFlameTest();
    initializeQualitativeTest();
    initializeReport();
    setCurrentDate();
});

// Tab switching functionality
function initializeTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.id.replace('tab-', 'content-');
            
            // Remove active class from all tabs
            tabButtons.forEach(btn => {
                btn.classList.remove('active', 'border-lab-blue', 'text-lab-blue');
                btn.classList.add('border-transparent', 'text-gray-500');
            });
            
            // Add active class to clicked tab
            this.classList.add('active', 'border-lab-blue', 'text-lab-blue');
            this.classList.remove('border-transparent', 'text-gray-500');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });
            
            // Show target tab content
            document.getElementById(targetTab).classList.remove('hidden');
        });
    });
}

// Flame test functionality
function initializeFlameTest() {
    // Cation selection buttons
    const cationButtons = document.querySelectorAll('.cation-btn');
    
    cationButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectedCation = this.dataset.cation;
            
            // Update button states
            cationButtons.forEach(btn => btn.classList.remove('ring-4', 'ring-white'));
            this.classList.add('ring-4', 'ring-white');
            
            // Reset flame and results
            resetFlame();
            flameResults.classList.add('hidden');
        });
    });
    
    // Ignite button
    igniteBtn.addEventListener('click', function() {
        if (!selectedCation) {
            alert('Сначала выберите катион для исследования!');
            return;
        }
        
        conductFlameTest();
    });
}

// Conduct flame test
async function conductFlameTest() {
    try {
        // Show loading state
        igniteBtn.disabled = true;
        igniteBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Проводится эксперимент...';
        
        // Animate flame ignition
        animateFlameIgnition();
        
        // Fetch test results
        const response = await axios.get(`/api/flame-test/${selectedCation}`);
        const result = response.data;
        
        // Wait for animation to complete
        setTimeout(() => {
            // Update flame color
            updateFlameColor(result.color);
            
            // Show results after flame color change
            setTimeout(() => {
                displayFlameResults(result);
                igniteBtn.disabled = false;
                igniteBtn.innerHTML = '<i class="fas fa-fire mr-2"></i>Поджечь горелку';
            }, 1500);
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка при проведении эксперимента:', error);
        alert('Произошла ошибка при проведении эксперимента');
        igniteBtn.disabled = false;
        igniteBtn.innerHTML = '<i class="fas fa-fire mr-2"></i>Поджечь горелку';
    }
}

// Animate flame ignition
function animateFlameIgnition() {
    flame.style.transform = 'translate(-50%, 0) scale(1.2)';
    flame.style.filter = 'brightness(1.5)';
}

// Update flame color based on cation
function updateFlameColor(color) {
    const flameBase = flame.querySelector('.flame-base');
    flameBase.style.background = `linear-gradient(to top, ${color}, ${color}80, transparent)`;
    flameBase.style.boxShadow = `0 0 20px ${color}80, 0 0 40px ${color}40`;
}

// Reset flame to default state
function resetFlame() {
    flame.style.transform = 'translate(-50%, 0) scale(1)';
    flame.style.filter = 'brightness(1)';
    const flameBase = flame.querySelector('.flame-base');
    flameBase.style.background = 'linear-gradient(to top, #f59e0b, #fbbf24, transparent)';
    flameBase.style.boxShadow = 'none';
}

// Display flame test results
function displayFlameResults(result) {
    document.getElementById('result-cation').textContent = result.cation;
    document.getElementById('result-color-sample').style.backgroundColor = result.color;
    document.getElementById('result-color-name').textContent = result.description.match(/([А-Яа-я-]+(?:\s[А-Яа-я-]+)*)\sокрашивание/)[1];
    document.getElementById('result-wavelength').textContent = result.wavelength;
    document.getElementById('result-description').textContent = result.description;
    
    flameResults.classList.remove('hidden');
    
    // Add to report button functionality
    document.getElementById('add-to-report-flame').onclick = function() {
        addFlameTestToReport(result);
    };
}

// Qualitative test functionality
function initializeQualitativeTest() {
    // Cation selection buttons
    const qualCationButtons = document.querySelectorAll('.qual-cation-btn');
    
    qualCationButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectedCation = this.dataset.cation;
            selectedReagent = null;
            
            // Update button states
            qualCationButtons.forEach(btn => btn.classList.remove('ring-4', 'ring-white'));
            this.classList.add('ring-4', 'ring-white');
            
            // Reset test tube and results
            resetTestTube();
            qualitativeResults.classList.add('hidden');
            conductTestBtn.disabled = true;
            
            // Update reagent selection
            updateReagentSelection();
        });
    });
    
    // Conduct test button
    conductTestBtn.addEventListener('click', function() {
        if (!selectedCation || !selectedReagent) {
            alert('Выберите катион и реагент!');
            return;
        }
        
        conductQualitativeTest();
    });
}

// Update reagent selection based on selected cation
function updateReagentSelection() {
    const reagentSelection = document.getElementById('reagent-selection');
    
    const reagentData = {
        'Fe2+': [
            { id: 'K3[Fe(CN)6]', name: 'K₃[Fe(CN)₆]', description: 'Гексацианоферрат(III) калия' },
            { id: 'KSCN', name: 'KSCN', description: 'Роданид калия' }
        ],
        'Fe3+': [
            { id: 'KSCN', name: 'KSCN', description: 'Роданид калия' },
            { id: 'K4[Fe(CN)6]', name: 'K₄[Fe(CN)₆]', description: 'Гексацианоферрат(II) калия' }
        ],
        'Cu2+': [
            { id: 'NH4OH', name: 'NH₄OH', description: 'Гидроксид аммония' },
            { id: 'NaOH', name: 'NaOH', description: 'Гидроксид натрия' }
        ]
    };
    
    const reagents = reagentData[selectedCation] || [];
    
    if (reagents.length === 0) {
        reagentSelection.innerHTML = '<p class="text-gray-500 italic">Реагенты не найдены</p>';
        return;
    }
    
    reagentSelection.innerHTML = reagents.map(reagent => `
        <button class="reagent-btn w-full text-left bg-gradient-to-r from-gray-400 to-gray-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-gray-500 hover:to-gray-700 transition-all" data-reagent="${reagent.id}">
            <div class="font-semibold">${reagent.name}</div>
            <div class="text-sm opacity-90">${reagent.description}</div>
        </button>
    `).join('');
    
    // Add event listeners to reagent buttons
    const reagentButtons = document.querySelectorAll('.reagent-btn');
    reagentButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectedReagent = this.dataset.reagent;
            
            // Update button states
            reagentButtons.forEach(btn => btn.classList.remove('ring-4', 'ring-white'));
            this.classList.add('ring-4', 'ring-white');
            
            // Enable conduct test button
            conductTestBtn.disabled = false;
            
            // Reset test tube and results
            resetTestTube();
            qualitativeResults.classList.add('hidden');
        });
    });
}

// Conduct qualitative test
async function conductQualitativeTest() {
    try {
        // Show loading state
        conductTestBtn.disabled = true;
        conductTestBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Проводится реакция...';
        
        // Animate dropper
        animateDropper();
        
        // Fetch test results
        const response = await axios.get(`/api/qualitative-test/${selectedCation}/${selectedReagent}`);
        const result = response.data;
        
        // Wait for animation to complete
        setTimeout(() => {
            // Update solution color
            updateSolutionColor(result.color);
            
            // Show results after color change
            setTimeout(() => {
                displayQualitativeResults(result);
                conductTestBtn.disabled = false;
                conductTestBtn.innerHTML = '<i class="fas fa-flask mr-2"></i>Провести реакцию';
            }, 1500);
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка при проведении реакции:', error);
        alert('Произошла ошибка при проведении реакции');
        conductTestBtn.disabled = false;
        conductTestBtn.innerHTML = '<i class="fas fa-flask mr-2"></i>Провести реакцию';
    }
}

// Animate dropper
function animateDropper() {
    dropper.style.transform = 'translate(-50%, 20px)';
    setTimeout(() => {
        dropper.style.transform = 'translate(-50%, 0)';
    }, 500);
}

// Update solution color
function updateSolutionColor(color) {
    testSolution.style.backgroundColor = color;
    testSolution.style.height = '20px';
    testSolution.style.boxShadow = `0 0 10px ${color}80`;
}

// Reset test tube to default state
function resetTestTube() {
    testSolution.style.backgroundColor = '#BFDBFE';
    testSolution.style.height = '12px';
    testSolution.style.boxShadow = 'none';
}

// Display qualitative test results
function displayQualitativeResults(result) {
    document.getElementById('qual-result-cation').textContent = result.cation;
    document.getElementById('qual-result-reagent').textContent = result.reagent;
    document.getElementById('qual-result-reaction').textContent = result.reaction;
    document.getElementById('qual-result-color-sample').style.backgroundColor = result.color;
    document.getElementById('qual-result-description').textContent = result.description;
    
    qualitativeResults.classList.remove('hidden');
    
    // Add to report button functionality
    document.getElementById('add-to-report-qual').onclick = function() {
        addQualitativeTestToReport(result);
    };
}

// Report functionality
function initializeReport() {
    document.getElementById('generate-report-btn').addEventListener('click', generateFullReport);
}

// Set current date
function setCurrentDate() {
    const now = new Date();
    const dateString = now.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    reportDate.textContent = dateString;
}

// Add flame test result to report
function addFlameTestToReport(result) {
    // Check if this cation already exists in results
    const existingIndex = flameTestResults.findIndex(r => r.cation === result.cation);
    if (existingIndex !== -1) {
        flameTestResults[existingIndex] = result;
    } else {
        flameTestResults.push(result);
    }
    
    updateFlameTestResultsDisplay();
    
    // Show success message
    showSuccessMessage('Результат добавлен в протокол!');
}

// Add qualitative test result to report
function addQualitativeTestToReport(result) {
    // Check if this combination already exists
    const existingIndex = qualitativeTestResults.findIndex(r => 
        r.cation === result.cation && r.reagent === result.reagent
    );
    if (existingIndex !== -1) {
        qualitativeTestResults[existingIndex] = result;
    } else {
        qualitativeTestResults.push(result);
    }
    
    updateQualitativeTestResultsDisplay();
    
    // Show success message
    showSuccessMessage('Результат добавлен в протокол!');
}

// Update flame test results display in report
function updateFlameTestResultsDisplay() {
    const container = document.getElementById('flame-test-results');
    
    if (flameTestResults.length === 0) {
        container.innerHTML = '<p class="text-gray-500 italic">Результаты будут добавлены после проведения экспериментов</p>';
        return;
    }
    
    container.innerHTML = flameTestResults.map((result, index) => `
        <div class="bg-white border rounded-lg p-4 mb-3">
            <div class="flex items-center justify-between">
                <h6 class="font-semibold text-gray-800">Опыт ${index + 1}: Исследование катиона ${result.cation}</h6>
                <button onclick="removeFlameTestResult(${index})" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                    <span class="font-medium text-gray-600">Катион:</span> ${result.cation}
                </div>
                <div class="flex items-center space-x-2">
                    <span class="font-medium text-gray-600">Цвет:</span>
                    <div class="w-4 h-4 rounded-full border border-gray-300" style="background-color: ${result.color}"></div>
                </div>
                <div>
                    <span class="font-medium text-gray-600">Длина волны:</span> ${result.wavelength}
                </div>
            </div>
            <div class="mt-2 text-sm">
                <span class="font-medium text-gray-600">Наблюдение:</span> ${result.description}
            </div>
        </div>
    `).join('');
}

// Update qualitative test results display in report
function updateQualitativeTestResultsDisplay() {
    const container = document.getElementById('qualitative-test-results');
    
    if (qualitativeTestResults.length === 0) {
        container.innerHTML = '<p class="text-gray-500 italic">Результаты будут добавлены после проведения экспериментов</p>';
        return;
    }
    
    container.innerHTML = qualitativeTestResults.map((result, index) => `
        <div class="bg-white border rounded-lg p-4 mb-3">
            <div class="flex items-center justify-between">
                <h6 class="font-semibold text-gray-800">Опыт ${index + 1}: ${result.cation} + ${result.reagent.split(' ')[0]}</h6>
                <button onclick="removeQualitativeTestResult(${index})" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="mt-2 text-sm">
                <div class="mb-2">
                    <span class="font-medium text-gray-600">Реагент:</span> ${result.reagent}
                </div>
                <div class="mb-2">
                    <span class="font-medium text-gray-600">Реакция:</span> 
                    <span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded">${result.reaction}</span>
                </div>
                <div class="mb-2 flex items-center space-x-2">
                    <span class="font-medium text-gray-600">Цвет:</span>
                    <div class="w-4 h-4 rounded-full border border-gray-300" style="background-color: ${result.color}"></div>
                    <span class="text-gray-600">${result.description}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Remove flame test result
function removeFlameTestResult(index) {
    if (confirm('Удалить этот результат из протокола?')) {
        flameTestResults.splice(index, 1);
        updateFlameTestResultsDisplay();
    }
}

// Remove qualitative test result
function removeQualitativeTestResult(index) {
    if (confirm('Удалить этот результат из протокола?')) {
        qualitativeTestResults.splice(index, 1);
        updateQualitativeTestResultsDisplay();
    }
}

// Generate full report
async function generateFullReport() {
    const studentName = document.getElementById('student-name').value.trim();
    const studentClass = document.getElementById('student-class').value.trim();
    const conclusion = document.getElementById('conclusion').value.trim();
    
    if (!studentName) {
        alert('Пожалуйста, введите ваше ФИО');
        document.getElementById('student-name').focus();
        return;
    }
    
    if (flameTestResults.length === 0 && qualitativeTestResults.length === 0) {
        alert('Проведите хотя бы один эксперимент перед формированием отчета');
        return;
    }
    
    try {
        const reportData = {
            studentName,
            studentClass,
            conclusion,
            flameTestResults,
            qualitativeTestResults,
            date: reportDate.textContent
        };
        
        const response = await axios.post('/api/generate-report', reportData);
        const report = response.data;
        
        // Generate and download report
        generatePDFReport(report);
        
    } catch (error) {
        console.error('Ошибка при создании отчета:', error);
        alert('Произошла ошибка при создании отчета');
    }
}

// Generate PDF report (simplified text version for now)
function generatePDFReport(reportData) {
    let reportText = `ПРОТОКОЛ ЛАБОРАТОРНОЙ РАБОТЫ
    
ТЕМА: Качественные реакции на катионы
ДАТА: ${reportData.date}
СТУДЕНТ: ${reportData.studentName}
КЛАСС: ${reportData.studentClass}

ЦЕЛЬ РАБОТЫ:
Изучить качественные реакции для определения катионов металлов методом окрашивания пламени и химических реакций.

ОБОРУДОВАНИЕ И РЕАКТИВЫ:
Оборудование: Горелка Бунзена, платиновая петля, пробирки, пипетки
Реактивы: Соли Li⁺, Na⁺, K⁺, Ca²⁺, Sr²⁺, Ba²⁺, Cu²⁺, K₃[Fe(CN)₆], K₄[Fe(CN)₆], KSCN, NH₄OH, NaOH

ХОД РАБОТЫ И РЕЗУЛЬТАТЫ:

Лабораторный опыт №3: Окрашивание пламени
`;

    reportData.flameTestResults.forEach((result, index) => {
        reportText += `
${index + 1}. Катион: ${result.cation}
   Цвет пламени: ${result.description}
   Длина волны: ${result.wavelength}
   Наблюдение: ${result.description}
`;
    });

    reportText += `
Лабораторный опыт №4: Качественные реакции
`;

    reportData.qualitativeTestResults.forEach((result, index) => {
        reportText += `
${index + 1}. Катион: ${result.cation}
   Реагент: ${result.reagent}
   Реакция: ${result.reaction}
   Наблюдение: ${result.description}
`;
    });

    if (reportData.conclusion) {
        reportText += `
ВЫВОД:
${reportData.conclusion}
`;
    }

    reportText += `

Отчет создан: ${reportData.generatedAt}
ID отчета: ${reportData.reportId}
`;

    // Create and download text file
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lab_report_${reportData.studentName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSuccessMessage('Отчет успешно сформирован и загружен!');
}

// Show success message
function showSuccessMessage(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    toast.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Error handling for API calls
axios.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error);
        if (error.response) {
            alert(`Ошибка: ${error.response.data.error || 'Неизвестная ошибка'}`);
        } else {
            alert('Ошибка подключения к серверу');
        }
        return Promise.reject(error);
    }
);