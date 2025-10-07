# 🚀 Пошаговое развертывание на Cloudflare Pages

## 📋 Готовый проект
**GitHub репозиторий**: https://github.com/somosu/chemistry-lab  
**Текущий URL для демо**: https://3000-is4cmt715dxtnbfhf20k5-6532622b.e2b.dev

## 🎯 Метод 1: Развертывание через Cloudflare Dashboard (РЕКОМЕНДУЕТСЯ)

### Шаг 1: Вход в Cloudflare
1. Перейдите на **[dash.cloudflare.com](https://dash.cloudflare.com)**
2. Войдите в ваш аккаунт Cloudflare
3. Если у вас нет аккаунта - зарегистрируйтесь (бесплатно)

### Шаг 2: Создание Pages проекта
1. В левом меню выберите **"Workers & Pages"**
2. Перейдите на вкладку **"Pages"**
3. Нажмите **"Create application"**
4. Выберите **"Connect to Git"**

### Шаг 3: Подключение GitHub
1. Выберите **"GitHub"** как источник
2. Если GitHub не подключен:
   - Нажмите **"Connect GitHub"**
   - Авторизуйтесь в GitHub
   - Разрешите доступ Cloudflare к репозиториям
3. Найдите и выберите репозиторий **"somosu/chemistry-lab"**

### Шаг 4: Настройка сборки
```
Project name: chemistry-lab-9th-grade
Production branch: main
Framework preset: None (не выбирайте фреймворк)
Build command: npm run build
Build output directory: dist
Root directory: / (оставьте пустым)
```

### Шаг 5: Переменные окружения (пропустить)
- На данном этапе переменные окружения не требуются
- Нажмите **"Save and Deploy"**

### Шаг 6: Ожидание развертывания
- Процесс займет **3-5 минут**
- Вы увидите логи сборки в реальном времени
- При успешном завершении получите URL

## 🎯 Метод 2: Через Wrangler CLI (если API работает)

```bash
# Аутентификация
npx wrangler login

# Создание проекта
npx wrangler pages project create chemistry-lab-9th-grade \
  --production-branch main \
  --compatibility-date 2024-01-01

# Развертывание
npm run build
npx wrangler pages deploy dist --project-name chemistry-lab-9th-grade
```

## 🎯 Метод 3: Ручная загрузка (резервный вариант)

Если Git подключение не работает:

1. **Скачайте архив dist**:
   ```bash
   cd /home/user/webapp
   npm run build
   cd dist
   zip -r chemistry-lab.zip .
   ```

2. **В Cloudflare Dashboard**:
   - **Workers & Pages** → **Pages**
   - **"Upload assets"**
   - Загрузите архив `chemistry-lab.zip`
   - Назовите проект: `chemistry-lab-9th-grade`

## ✅ Ожидаемые результаты

### После успешного развертывания вы получите:
- **Production URL**: `https://chemistry-lab-9th-grade.pages.dev`
- **Автоматические обновления** при каждом push в GitHub
- **Глобальный CDN** для быстрой загрузки
- **HTTPS по умолчанию**
- **Бесплатный хостинг** навсегда

### Функциональность:
✅ **Лабораторный опыт №3**: Окрашивание пламени (7 катионов)  
✅ **Лабораторный опыт №4**: Качественные реакции на катионы  
✅ **Лабораторный опыт №5**: Качественные реакции на анионы (8 анионов)  
✅ **Автоматический протокол**: Полная лабораторная работа  
✅ **Соответствие стандартам**: 9.4.1.8, 9.4.1.9, 9.4.1.10  

## 🔧 Настройки проекта (уже настроено)

### wrangler.jsonc
```json
{
  "name": "chemistry-lab-9th-grade",
  "compatibility_date": "2024-10-05", 
  "pages_build_output_dir": "./dist",
  "compatibility_flags": ["nodejs_compat"]
}
```

### package.json (релевантные скрипты)
```json
{
  "scripts": {
    "build": "vite build",
    "deploy": "npm run build && wrangler pages deploy dist --project-name chemistry-lab-9th-grade"
  }
}
```

## 🐛 Устранение неполадок

### Проблема: "Build failed"
**Решение**: Проверьте Build logs в Dashboard. Обычно помогает:
- Убедитесь, что Build command: `npm run build`
- Output directory: `dist`
- Node.js version: 18 (автоматически)

### Проблема: "404 на сайте"
**Решение**: 
- Проверьте, что файлы находятся в папке `dist`
- Убедитесь, что `_worker.js` присутствует в выходной директории

### Проблема: "Function errors"
**Решение**: 
- Откройте **Functions** в Dashboard
- Проверьте логи ошибок
- Убедитесь, что compatibility flags включают `nodejs_compat`

## 📱 Тестирование после развертывания

После получения URL протестируйте:

1. **Главная страница**: `https://chemistry-lab-9th-grade.pages.dev`
2. **API endpoints**:
   - `/api/flame-test/Na+`
   - `/api/qualitative-test/Fe3+/KSCN`
   - `/api/anion-test/Cl-/AgNO3`
3. **Все вкладки** интерфейса
4. **Генерацию протоколов**

## 🎉 Готово!

После успешного развертывания ваша виртуальная химическая лаборатория будет доступна по постоянному URL и готова к использованию в учебном процессе!

**Время развертывания**: 3-5 минут  
**Стоимость**: Бесплатно навсегда  
**Производительность**: Глобальная сеть Cloudflare  
**Обновления**: Автоматические при push в GitHub  