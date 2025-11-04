// Управление вкладками
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Убираем активный класс у всех кнопок и контента
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Добавляем активный класс к выбранным
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// ==================== ЭКСПЕРИМЕНТ 1: Определение хлоридов ====================

class Experiment1 {
    constructor() {
        this.canvas = document.getElementById('canvas1');
        this.ctx = this.canvas.getContext('2d');
        this.stage = 0;
        this.sampleMass = 1.0;
        this.waterVolume = 100;
        this.precipitateMass = 0;
        this.animationFrame = 0;
        this.particles = [];
        
        this.setupControls();
        this.draw();
    }
    
    setupControls() {
        // Слайдеры
        document.getElementById('sample-mass-1').addEventListener('input', (e) => {
            this.sampleMass = parseFloat(e.target.value);
            document.getElementById('sample-mass-1-value').textContent = this.sampleMass.toFixed(1);
        });
        
        document.getElementById('water-volume-1').addEventListener('input', (e) => {
            this.waterVolume = parseInt(e.target.value);
            document.getElementById('water-volume-1-value').textContent = this.waterVolume;
        });
        
        // Кнопки
        document.getElementById('btn-weigh-1').addEventListener('click', () => this.weigh());
        document.getElementById('btn-dissolve-1').addEventListener('click', () => this.dissolve());
        document.getElementById('btn-add-reagent-1').addEventListener('click', () => this.addReagent());
        document.getElementById('btn-filter-1').addEventListener('click', () => this.filter());
        document.getElementById('btn-dry-1').addEventListener('click', () => this.dry());
        document.getElementById('btn-weigh-final-1').addEventListener('click', () => this.weighFinal());
        document.getElementById('btn-reset-1').addEventListener('click', () => this.reset());
    }
    
    updateStatus(message) {
        document.getElementById('status-1').textContent = message;
    }
    
    updateResults(html) {
        document.getElementById('results-1').innerHTML = html;
    }
    
    enableButton(id) {
        document.getElementById(id).disabled = false;
    }
    
    disableButton(id) {
        document.getElementById(id).disabled = true;
    }
    
    weigh() {
        this.stage = 1;
        this.updateStatus('✅ Навеска взвешена: ' + this.sampleMass.toFixed(2) + ' г NaCl');
        this.enableButton('btn-dissolve-1');
        this.disableButton('btn-weigh-1');
        this.draw();
    }
    
    dissolve() {
        this.stage = 2;
        this.updateStatus('🌊 Растворение в воде... Образуется прозрачный раствор');
        this.enableButton('btn-add-reagent-1');
        this.disableButton('btn-dissolve-1');
        this.createDissolutionParticles();
        this.animateDissolution();
    }
    
    addReagent() {
        this.stage = 3;
        this.updateStatus('⚗️ Добавление AgNO₃... Образуется белый осадок AgCl!');
        this.enableButton('btn-filter-1');
        this.disableButton('btn-add-reagent-1');
        this.createPrecipitateParticles();
        this.animatePrecipitation();
    }
    
    filter() {
        this.stage = 4;
        this.updateStatus('🔬 Фильтрование... Осадок отделён от раствора');
        this.enableButton('btn-dry-1');
        this.disableButton('btn-filter-1');
        this.draw();
    }
    
    dry() {
        this.stage = 5;
        this.updateStatus('🔥 Высушивание при 110°C... Удаление влаги');
        this.enableButton('btn-weigh-final-1');
        this.disableButton('btn-dry-1');
        this.draw();
    }
    
    weighFinal() {
        this.stage = 6;
        
        // Расчёт массы осадка AgCl
        // NaCl -> Cl⁻ -> AgCl
        // M(NaCl) = 58.5 г/моль, M(AgCl) = 143.5 г/моль
        // n(NaCl) = m / M = sampleMass / 58.5
        // n(AgCl) = n(NaCl) = n(Cl⁻)
        // m(AgCl) = n × M(AgCl)
        
        this.precipitateMass = (this.sampleMass / 58.5) * 143.5;
        
        // Гравиметрический фактор F = M(Cl) / M(AgCl) = 35.5 / 143.5
        const gravFactor = 35.5 / 143.5;
        const chlorideContent = (this.precipitateMass * gravFactor / this.sampleMass) * 100;
        
        this.updateStatus('✅ Анализ завершён! Осадок взвешен');
        
        const results = `
            <strong>📊 РЕЗУЛЬТАТЫ АНАЛИЗА:</strong><br><br>
            Масса навески NaCl: ${this.sampleMass.toFixed(3)} г<br>
            Масса осадка AgCl: ${this.precipitateMass.toFixed(3)} г<br><br>
            <strong>Расчёты:</strong><br>
            Гравиметрический фактор F = 35.5/143.5 = ${gravFactor.toFixed(4)}<br>
            Содержание Cl⁻ = (${this.precipitateMass.toFixed(3)} × ${gravFactor.toFixed(4)}) / ${this.sampleMass.toFixed(3)} × 100%<br>
            <strong>ω(Cl⁻) = ${chlorideContent.toFixed(2)}%</strong><br><br>
            <em>Теоретическое содержание Cl⁻ в NaCl = 60.66%</em>
        `;
        
        this.updateResults(results);
        this.disableButton('btn-weigh-final-1');
        this.draw();
    }
    
    reset() {
        this.stage = 0;
        this.particles = [];
        this.updateStatus('Готов к началу');
        this.updateResults('');
        
        this.enableButton('btn-weigh-1');
        this.disableButton('btn-dissolve-1');
        this.disableButton('btn-add-reagent-1');
        this.disableButton('btn-filter-1');
        this.disableButton('btn-dry-1');
        this.disableButton('btn-weigh-final-1');
        
        this.draw();
    }
    
    createDissolutionParticles() {
        this.particles = [];
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: 250 + Math.random() * 50,
                y: 200 + Math.random() * 50,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: 3 + Math.random() * 3,
                color: 'rgba(100, 150, 255, 0.6)'
            });
        }
    }
    
    createPrecipitateParticles() {
        this.particles = [];
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: 250 + Math.random() * 100,
                y: 150 + Math.random() * 100,
                vy: 0.5 + Math.random() * 1,
                size: 4 + Math.random() * 4,
                color: 'rgba(240, 240, 240, 0.9)',
                falling: true
            });
        }
    }
    
    animateDissolution() {
        if (this.stage !== 2) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBasicSetup();
        
        // Обновление и отрисовка частиц
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            // Отскок от стенок
            if (p.x < 200 || p.x > 350) p.vx *= -1;
            if (p.y < 150 || p.y > 350) p.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
        });
        
        this.animationFrame++;
        if (this.animationFrame < 100) {
            requestAnimationFrame(() => this.animateDissolution());
        } else {
            this.animationFrame = 0;
            this.draw();
        }
    }
    
    animatePrecipitation() {
        if (this.stage !== 3) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBasicSetup();
        
        // Обновление и отрисовка осадка
        this.particles.forEach(p => {
            if (p.falling) {
                p.y += p.vy;
                
                // Остановка на дне
                if (p.y > 340) {
                    p.y = 340;
                    p.falling = false;
                }
            }
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
        });
        
        this.animationFrame++;
        if (this.animationFrame < 150) {
            requestAnimationFrame(() => this.animatePrecipitation());
        } else {
            this.animationFrame = 0;
            this.draw();
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBasicSetup();
        
        switch(this.stage) {
            case 0:
                this.drawInitialState();
                break;
            case 1:
                this.drawSample();
                break;
            case 2:
                this.drawDissolved();
                break;
            case 3:
                this.drawPrecipitate();
                break;
            case 4:
                this.drawFiltered();
                break;
            case 5:
                this.drawDried();
                break;
            case 6:
                this.drawFinal();
                break;
        }
    }
    
    drawBasicSetup() {
        // Лабораторный стол
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, 400, 800, 100);
        
        // Надпись
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillText('Определение хлоридов методом осаждения', 50, 40);
    }
    
    drawInitialState() {
        // Весы
        this.drawScale(100, 250);
        
        // Реагенты на полке
        this.drawBottle(500, 200, 'NaCl', '#fff');
        this.drawBottle(600, 200, 'AgNO₃', '#ffa');
        
        this.ctx.fillStyle = '#555';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Начните с взвешивания навески', 200, 450);
    }
    
    drawSample() {
        // Весы с навеской
        this.drawScale(100, 250);
        this.drawSampleOnScale(200, 280);
        
        // Реагенты
        this.drawBottle(500, 200, 'NaCl', '#fff');
        this.drawBottle(600, 200, 'AgNO₃', '#ffa');
    }
    
    drawDissolved() {
        // Стакан с раствором
        this.drawBeaker(250, 200, 'lightblue');
        
        // Реагенты
        this.drawBottle(600, 200, 'AgNO₃', '#ffa');
    }
    
    drawPrecipitate() {
        // Стакан с осадком
        this.drawBeaker(250, 200, 'lightblue');
        
        // Осадок на дне
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(220, 340, 110, 30);
        
        this.ctx.fillStyle = '#333';
        this.ctx.font = '14px Arial';
        this.ctx.fillText('AgCl↓', 260, 360);
    }
    
    drawFiltered() {
        // Фильтровальная воронка
        this.drawFunnel(250, 150);
        
        // Осадок на фильтре
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(275, 200, 30, 0, Math.PI, true);
        this.ctx.fill();
        
        // Стакан с фильтратом
        this.drawBeaker(400, 300, 'lightblue', 0.3);
    }
    
    drawDried() {
        // Сушильный шкаф
        this.drawOven(200, 180);
        
        // Тигель внутри
        this.drawCrucible(270, 280);
    }
    
    drawFinal() {
        // Весы с тиглем
        this.drawScale(100, 250);
        this.drawCrucible(200, 290);
        
        // Результат
        this.ctx.fillStyle = 'green';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillText('✓ Анализ завершён!', 400, 300);
    }
    
    // Вспомогательные методы отрисовки
    drawScale(x, y) {
        // Основание весов
        this.ctx.fillStyle = '#ddd';
        this.ctx.fillRect(x, y + 80, 150, 20);
        
        // Чаша
        this.ctx.fillStyle = '#e0e0e0';
        this.ctx.beginPath();
        this.ctx.arc(x + 75, y + 80, 50, 0, Math.PI, true);
        this.ctx.lineTo(x + 25, y + 80);
        this.ctx.fill();
        
        // Дисплей
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x + 30, y, 90, 40);
        this.ctx.fillStyle = '#0f0';
        this.ctx.font = '16px monospace';
        this.ctx.fillText(this.sampleMass.toFixed(3) + ' g', x + 35, y + 25);
    }
    
    drawBottle(x, y, label, color) {
        // Бутылка
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, 40, 80);
        this.ctx.fillRect(x + 10, y - 20, 20, 20);
        
        // Контур
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, 40, 80);
        
        // Этикетка
        this.ctx.fillStyle = '#333';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(label, x + 5, y + 45);
    }
    
    drawBeaker(x, y, color, alpha = 1) {
        // Стакан
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x - 30, y + 200);
        this.ctx.lineTo(x + 130, y + 200);
        this.ctx.lineTo(x + 100, y);
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Раствор
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = alpha;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 5, y + 50);
        this.ctx.lineTo(x - 20, y + 195);
        this.ctx.lineTo(x + 120, y + 195);
        this.ctx.lineTo(x + 95, y + 50);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }
    
    drawFunnel(x, y) {
        // Воронка
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 50, y);
        this.ctx.lineTo(x, y + 80);
        this.ctx.lineTo(x + 50, y);
        this.ctx.stroke();
        
        // Трубка
        this.ctx.fillStyle = '#ddd';
        this.ctx.fillRect(x - 5, y + 80, 10, 40);
        this.ctx.strokeRect(x - 5, y + 80, 10, 40);
    }
    
    drawOven(x, y) {
        // Корпус печи
        this.ctx.fillStyle = '#555';
        this.ctx.fillRect(x, y, 180, 150);
        
        // Дверца
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x + 10, y + 10, 160, 130);
        
        // Окно
        this.ctx.fillStyle = '#f00';
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillRect(x + 30, y + 30, 120, 90);
        this.ctx.globalAlpha = 1;
        
        // Индикатор
        this.ctx.fillStyle = '#f00';
        this.ctx.beginPath();
        this.ctx.arc(x + 160, y + 20, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Температура
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText('110°C', x + 60, y + 80);
    }
    
    drawCrucible(x, y) {
        // Тигель
        this.ctx.fillStyle = '#ccc';
        this.ctx.beginPath();
        this.ctx.moveTo(x - 10, y);
        this.ctx.lineTo(x - 15, y + 30);
        this.ctx.lineTo(x + 15, y + 30);
        this.ctx.lineTo(x + 10, y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawSampleOnScale(x, y) {
        // Порошок на чаше весов
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, 20, 10, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
    }
}

// ==================== ЭКСПЕРИМЕНТ 2: Определение сульфатов ====================

class Experiment2 {
    constructor() {
        this.canvas = document.getElementById('canvas2');
        this.ctx = this.canvas.getContext('2d');
        this.stage = 0;
        this.sampleMass = 1.0;
        this.waterVolume = 100;
        this.precipitateMass = 0;
        this.animationFrame = 0;
        this.particles = [];
        
        this.setupControls();
        this.draw();
    }
    
    setupControls() {
        // Слайдеры
        document.getElementById('sample-mass-2').addEventListener('input', (e) => {
            this.sampleMass = parseFloat(e.target.value);
            document.getElementById('sample-mass-2-value').textContent = this.sampleMass.toFixed(1);
        });
        
        document.getElementById('water-volume-2').addEventListener('input', (e) => {
            this.waterVolume = parseInt(e.target.value);
            document.getElementById('water-volume-2-value').textContent = this.waterVolume;
        });
        
        // Кнопки
        document.getElementById('btn-weigh-2').addEventListener('click', () => this.weigh());
        document.getElementById('btn-dissolve-2').addEventListener('click', () => this.dissolve());
        document.getElementById('btn-add-reagent-2').addEventListener('click', () => this.addReagent());
        document.getElementById('btn-filter-2').addEventListener('click', () => this.filter());
        document.getElementById('btn-dry-2').addEventListener('click', () => this.dry());
        document.getElementById('btn-weigh-final-2').addEventListener('click', () => this.weighFinal());
        document.getElementById('btn-reset-2').addEventListener('click', () => this.reset());
    }
    
    updateStatus(message) {
        document.getElementById('status-2').textContent = message;
    }
    
    updateResults(html) {
        document.getElementById('results-2').innerHTML = html;
    }
    
    enableButton(id) {
        document.getElementById(id).disabled = false;
    }
    
    disableButton(id) {
        document.getElementById(id).disabled = true;
    }
    
    weigh() {
        this.stage = 1;
        this.updateStatus('✅ Навеска взвешена: ' + this.sampleMass.toFixed(2) + ' г Na₂SO₄');
        this.enableButton('btn-dissolve-2');
        this.disableButton('btn-weigh-2');
        this.draw();
    }
    
    dissolve() {
        this.stage = 2;
        this.updateStatus('🌊 Растворение в воде... Образуется прозрачный раствор');
        this.enableButton('btn-add-reagent-2');
        this.disableButton('btn-dissolve-2');
        this.createDissolutionParticles();
        this.animateDissolution();
    }
    
    addReagent() {
        this.stage = 3;
        this.updateStatus('⚗️ Добавление BaCl₂... Образуется белый осадок BaSO₄!');
        this.enableButton('btn-filter-2');
        this.disableButton('btn-add-reagent-2');
        this.createPrecipitateParticles();
        this.animatePrecipitation();
    }
    
    filter() {
        this.stage = 4;
        this.updateStatus('🔬 Фильтрование... Осадок отделён от раствора');
        this.enableButton('btn-dry-2');
        this.disableButton('btn-filter-2');
        this.draw();
    }
    
    dry() {
        this.stage = 5;
        this.updateStatus('🔥 Прокаливание при 800°C... Удаление влаги');
        this.enableButton('btn-weigh-final-2');
        this.disableButton('btn-dry-2');
        this.draw();
    }
    
    weighFinal() {
        this.stage = 6;
        
        // Расчёт массы осадка BaSO₄
        // Na₂SO₄ -> SO₄²⁻ -> BaSO₄
        // M(Na₂SO₄) = 142 г/моль, M(BaSO₄) = 233 г/моль
        // n(Na₂SO₄) = m / M = sampleMass / 142
        // n(BaSO₄) = n(Na₂SO₄) = n(SO₄²⁻)
        // m(BaSO₄) = n × M(BaSO₄)
        
        this.precipitateMass = (this.sampleMass / 142) * 233;
        
        // Гравиметрический фактор F = M(SO₄) / M(BaSO₄) = 96 / 233
        const gravFactor = 96 / 233;
        const sulfateContent = (this.precipitateMass * gravFactor / this.sampleMass) * 100;
        
        this.updateStatus('✅ Анализ завершён! Осадок взвешен');
        
        const results = `
            <strong>📊 РЕЗУЛЬТАТЫ АНАЛИЗА:</strong><br><br>
            Масса навески Na₂SO₄: ${this.sampleMass.toFixed(3)} г<br>
            Масса осадка BaSO₄: ${this.precipitateMass.toFixed(3)} г<br><br>
            <strong>Расчёты:</strong><br>
            Гравиметрический фактор F = 96/233 = ${gravFactor.toFixed(4)}<br>
            Содержание SO₄²⁻ = (${this.precipitateMass.toFixed(3)} × ${gravFactor.toFixed(4)}) / ${this.sampleMass.toFixed(3)} × 100%<br>
            <strong>ω(SO₄²⁻) = ${sulfateContent.toFixed(2)}%</strong><br><br>
            <em>Теоретическое содержание SO₄²⁻ в Na₂SO₄ = 67.61%</em>
        `;
        
        this.updateResults(results);
        this.disableButton('btn-weigh-final-2');
        this.draw();
    }
    
    reset() {
        this.stage = 0;
        this.particles = [];
        this.updateStatus('Готов к началу');
        this.updateResults('');
        
        this.enableButton('btn-weigh-2');
        this.disableButton('btn-dissolve-2');
        this.disableButton('btn-add-reagent-2');
        this.disableButton('btn-filter-2');
        this.disableButton('btn-dry-2');
        this.disableButton('btn-weigh-final-2');
        
        this.draw();
    }
    
    createDissolutionParticles() {
        this.particles = [];
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: 250 + Math.random() * 50,
                y: 200 + Math.random() * 50,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: 3 + Math.random() * 3,
                color: 'rgba(150, 200, 255, 0.6)'
            });
        }
    }
    
    createPrecipitateParticles() {
        this.particles = [];
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: 250 + Math.random() * 100,
                y: 150 + Math.random() * 100,
                vy: 0.5 + Math.random() * 1,
                size: 4 + Math.random() * 4,
                color: 'rgba(255, 255, 255, 0.95)',
                falling: true
            });
        }
    }
    
    animateDissolution() {
        if (this.stage !== 2) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBasicSetup();
        
        // Обновление и отрисовка частиц
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            // Отскок от стенок
            if (p.x < 200 || p.x > 350) p.vx *= -1;
            if (p.y < 150 || p.y > 350) p.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
        });
        
        this.animationFrame++;
        if (this.animationFrame < 100) {
            requestAnimationFrame(() => this.animateDissolution());
        } else {
            this.animationFrame = 0;
            this.draw();
        }
    }
    
    animatePrecipitation() {
        if (this.stage !== 3) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBasicSetup();
        
        // Обновление и отрисовка осадка
        this.particles.forEach(p => {
            if (p.falling) {
                p.y += p.vy;
                
                // Остановка на дне
                if (p.y > 340) {
                    p.y = 340;
                    p.falling = false;
                }
            }
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
        });
        
        this.animationFrame++;
        if (this.animationFrame < 150) {
            requestAnimationFrame(() => this.animatePrecipitation());
        } else {
            this.animationFrame = 0;
            this.draw();
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBasicSetup();
        
        switch(this.stage) {
            case 0:
                this.drawInitialState();
                break;
            case 1:
                this.drawSample();
                break;
            case 2:
                this.drawDissolved();
                break;
            case 3:
                this.drawPrecipitate();
                break;
            case 4:
                this.drawFiltered();
                break;
            case 5:
                this.drawDried();
                break;
            case 6:
                this.drawFinal();
                break;
        }
    }
    
    drawBasicSetup() {
        // Лабораторный стол
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, 400, 800, 100);
        
        // Надпись
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillText('Определение сульфатов методом осаждения', 50, 40);
    }
    
    drawInitialState() {
        // Весы
        this.drawScale(100, 250);
        
        // Реагенты на полке
        this.drawBottle(500, 200, 'Na₂SO₄', '#fff');
        this.drawBottle(600, 200, 'BaCl₂', '#ffa');
        
        this.ctx.fillStyle = '#555';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Начните с взвешивания навески', 200, 450);
    }
    
    drawSample() {
        // Весы с навеской
        this.drawScale(100, 250);
        this.drawSampleOnScale(200, 280);
        
        // Реагенты
        this.drawBottle(500, 200, 'Na₂SO₄', '#fff');
        this.drawBottle(600, 200, 'BaCl₂', '#ffa');
    }
    
    drawDissolved() {
        // Стакан с раствором
        this.drawBeaker(250, 200, 'lightblue');
        
        // Реагенты
        this.drawBottle(600, 200, 'BaCl₂', '#ffa');
    }
    
    drawPrecipitate() {
        // Стакан с осадком
        this.drawBeaker(250, 200, 'lightblue');
        
        // Осадок на дне
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(220, 340, 110, 30);
        
        this.ctx.fillStyle = '#333';
        this.ctx.font = '14px Arial';
        this.ctx.fillText('BaSO₄↓', 250, 360);
    }
    
    drawFiltered() {
        // Фильтровальная воронка
        this.drawFunnel(250, 150);
        
        // Осадок на фильтре
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(275, 200, 30, 0, Math.PI, true);
        this.ctx.fill();
        
        // Стакан с фильтратом
        this.drawBeaker(400, 300, 'lightblue', 0.3);
    }
    
    drawDried() {
        // Муфельная печь (высокотемпературная)
        this.drawMuffleFurnace(200, 180);
        
        // Тигель внутри
        this.drawCrucible(270, 280);
    }
    
    drawFinal() {
        // Весы с тиглем
        this.drawScale(100, 250);
        this.drawCrucible(200, 290);
        
        // Результат
        this.ctx.fillStyle = 'green';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillText('✓ Анализ завершён!', 400, 300);
    }
    
    // Вспомогательные методы отрисовки
    drawScale(x, y) {
        // Основание весов
        this.ctx.fillStyle = '#ddd';
        this.ctx.fillRect(x, y + 80, 150, 20);
        
        // Чаша
        this.ctx.fillStyle = '#e0e0e0';
        this.ctx.beginPath();
        this.ctx.arc(x + 75, y + 80, 50, 0, Math.PI, true);
        this.ctx.lineTo(x + 25, y + 80);
        this.ctx.fill();
        
        // Дисплей
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x + 30, y, 90, 40);
        this.ctx.fillStyle = '#0f0';
        this.ctx.font = '16px monospace';
        this.ctx.fillText(this.sampleMass.toFixed(3) + ' g', x + 35, y + 25);
    }
    
    drawBottle(x, y, label, color) {
        // Бутылка
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, 40, 80);
        this.ctx.fillRect(x + 10, y - 20, 20, 20);
        
        // Контур
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, 40, 80);
        
        // Этикетка
        this.ctx.fillStyle = '#333';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(label, x + 5, y + 45);
    }
    
    drawBeaker(x, y, color, alpha = 1) {
        // Стакан
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x - 30, y + 200);
        this.ctx.lineTo(x + 130, y + 200);
        this.ctx.lineTo(x + 100, y);
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Раствор
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = alpha;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 5, y + 50);
        this.ctx.lineTo(x - 20, y + 195);
        this.ctx.lineTo(x + 120, y + 195);
        this.ctx.lineTo(x + 95, y + 50);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }
    
    drawFunnel(x, y) {
        // Воронка
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 50, y);
        this.ctx.lineTo(x, y + 80);
        this.ctx.lineTo(x + 50, y);
        this.ctx.stroke();
        
        // Трубка
        this.ctx.fillStyle = '#ddd';
        this.ctx.fillRect(x - 5, y + 80, 10, 40);
        this.ctx.strokeRect(x - 5, y + 80, 10, 40);
    }
    
    drawMuffleFurnace(x, y) {
        // Корпус муфельной печи
        this.ctx.fillStyle = '#555';
        this.ctx.fillRect(x, y, 180, 150);
        
        // Дверца
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x + 10, y + 10, 160, 130);
        
        // Окно (более яркое свечение для высокой температуры)
        this.ctx.fillStyle = '#ff6600';
        this.ctx.globalAlpha = 0.5;
        this.ctx.fillRect(x + 30, y + 30, 120, 90);
        this.ctx.globalAlpha = 1;
        
        // Индикатор
        this.ctx.fillStyle = '#f00';
        this.ctx.beginPath();
        this.ctx.arc(x + 160, y + 20, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Температура
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText('800°C', x + 60, y + 80);
    }
    
    drawCrucible(x, y) {
        // Тигель
        this.ctx.fillStyle = '#ccc';
        this.ctx.beginPath();
        this.ctx.moveTo(x - 10, y);
        this.ctx.lineTo(x - 15, y + 30);
        this.ctx.lineTo(x + 15, y + 30);
        this.ctx.lineTo(x + 10, y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawSampleOnScale(x, y) {
        // Порошок на чаше весов
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, 20, 10, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
    }
}

// ==================== ТЕСТ ====================

const quizAnswers = {
    q1: 'b',
    q2: 'b',
    q3: 'c',
    q4: 'b',
    q5: 'b'
};

document.getElementById('check-answers').addEventListener('click', () => {
    let score = 0;
    let total = Object.keys(quizAnswers).length;
    
    for (let [question, correctAnswer] of Object.entries(quizAnswers)) {
        const selected = document.querySelector(`input[name="${question}"]:checked`);
        const questionCard = document.querySelector(`[data-question="${question.slice(1)}"]`);
        const feedback = questionCard.querySelector('.feedback');
        
        if (selected) {
            if (selected.value === correctAnswer) {
                score++;
                feedback.textContent = '✓ Правильно!';
                feedback.className = 'feedback correct';
            } else {
                feedback.textContent = '✗ Неправильно. Правильный ответ выделен.';
                feedback.className = 'feedback incorrect';
                
                // Подсветить правильный ответ
                const correctOption = questionCard.querySelector(`input[value="${correctAnswer}"]`).parentElement;
                correctOption.style.border = '2px solid green';
            }
        } else {
            feedback.textContent = '⚠ Вы не выбрали ответ.';
            feedback.className = 'feedback incorrect';
        }
    }
    
    const resultsDiv = document.getElementById('quiz-results');
    const percentage = (score / total * 100).toFixed(0);
    
    let message = '';
    if (percentage >= 80) {
        message = '🎉 Отлично! Вы отлично усвоили материал!';
    } else if (percentage >= 60) {
        message = '👍 Хорошо! Но есть куда расти.';
    } else {
        message = '📚 Рекомендуем повторить теоретический материал.';
    }
    
    resultsDiv.innerHTML = `
        <strong>Ваш результат: ${score} из ${total} (${percentage}%)</strong><br>
        ${message}
    `;
    resultsDiv.className = 'quiz-results show';
    
    // Прокрутка к результатам
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Инициализация экспериментов при загрузке страницы
let experiment1, experiment2;

document.addEventListener('DOMContentLoaded', () => {
    experiment1 = new Experiment1();
    experiment2 = new Experiment2();
});
