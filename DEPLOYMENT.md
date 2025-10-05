# 🚀 Инструкция по развертыванию химической лаборатории

## Метод 1: Автоматическое развертывание (рекомендуется)

### Предварительные требования
1. **Аккаунт Cloudflare** - зарегистрируйтесь на [cloudflare.com](https://cloudflare.com)
2. **Node.js** версии 18 или выше
3. **API токен Cloudflare** с правами на Pages

### Шаги развертывания

#### 1. Аутентификация в Cloudflare
```bash
npx wrangler login
```
Это откроет браузер для авторизации в вашем аккаунте Cloudflare.

#### 2. Автоматическое развертывание
```bash
./deploy.sh
```

Или выполните команды вручную:
```bash
# Сборка проекта
npm run build

# Создание проекта Pages
npx wrangler pages project create chemistry-lab-9th-grade \
    --production-branch main \
    --compatibility-date 2024-01-01

# Развертывание
npx wrangler pages deploy dist --project-name chemistry-lab-9th-grade
```

---

## Метод 2: Развертывание через GitHub + Cloudflare Dashboard

### 1. Загрузка в GitHub

#### Создайте новый репозиторий на GitHub:
1. Перейдите на [github.com](https://github.com)
2. Нажмите "New repository"
3. Название: `chemistry-lab-virtual`
4. Описание: `Виртуальная химическая лаборатория для 9 класса`
5. Выберите Public или Private
6. НЕ добавляйте README, .gitignore или лицензию (они уже есть)

#### Загрузите код:
```bash
# Добавьте удаленный репозиторий
git remote add origin https://github.com/YOUR_USERNAME/chemistry-lab-virtual.git

# Отправьте код
git branch -M main
git push -u origin main
```

### 2. Подключение к Cloudflare Pages

#### Через Cloudflare Dashboard:
1. Войдите в [dash.cloudflare.com](https://dash.cloudflare.com)
2. Перейдите в **Workers & Pages** → **Pages**
3. Нажмите **"Create application"** → **"Connect to Git"**
4. Выберите ваш GitHub репозиторий
5. Настройки сборки:
   - **Framework preset**: `None`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (оставить пустым)

#### Переменные окружения (если нужны):
В разделе **Environment variables** добавьте:
- Пока дополнительных переменных не требуется

### 3. Настройка домена (опционально)
1. В настройках Pages перейдите в **Custom domains**
2. Добавьте ваш домен или используйте предоставленный `*.pages.dev`

---

## Метод 3: Ручная загрузка файлов

Если у вас нет доступа к CLI или GitHub:

### 1. Подготовка файлов
```bash
# Создайте архив с собранными файлами
npm run build
cd dist
zip -r chemistry-lab.zip .
```

### 2. Ручная загрузка через Dashboard
1. Перейдите в **Cloudflare Dashboard** → **Pages**
2. Нажмите **"Upload assets"**
3. Загрузите архив `chemistry-lab.zip`
4. Настройте название проекта: `chemistry-lab-9th-grade`

---

## 🛠 Конфигурация проекта

### wrangler.jsonc
```json
{
  "name": "chemistry-lab-9th-grade",
  "compatibility_date": "2024-01-01",
  "pages_build_output_dir": "./dist",
  "compatibility_flags": ["nodejs_compat"]
}
```

### Команды для разработки
```bash
# Локальная разработка
npm run dev

# Сборка проекта
npm run build

# Предварительный просмотр
npm run preview

# Развертывание (после настройки)
npm run deploy
```

---

## 🔧 Устранение неполадок

### Проблема: "Authentication error"
**Решение**: Убедитесь, что вы вошли в Cloudflare:
```bash
npx wrangler logout
npx wrangler login
```

### Проблема: "Project already exists"
**Решение**: Используйте существующий проект:
```bash
npx wrangler pages deploy dist --project-name chemistry-lab-9th-grade
```

### Проблема: Файлы не обновляются
**Решение**: Очистите кеш и пересоберите:
```bash
rm -rf dist .wrangler
npm run build
```

---

## 📱 Проверка развертывания

После успешного развертывания ваша лаборатория будет доступна по адресу:
- **Production**: `https://chemistry-lab-9th-grade.pages.dev`
- **Или**: `https://main.chemistry-lab-9th-grade.pages.dev`

### Тестирование функциональности:
1. Откройте URL в браузере
2. Проверьте все 4 вкладки
3. Протестируйте эксперименты с пламенем
4. Проверьте качественные реакции
5. Создайте тестовый протокол

---

## 🎯 Дополнительные возможности

### Пользовательский домен
Можете подключить собственный домен в настройках Cloudflare Pages

### Аналитика
Cloudflare предоставляет бесплатную аналитику посещений

### CDN и производительность
Ваше приложение автоматически распространяется по глобальной сети Cloudflare

---

## 🆘 Поддержка

Если у вас возникли проблемы:
1. Проверьте [статус Cloudflare](https://www.cloudflarestatus.com/)
2. Посетите [документацию Cloudflare Pages](https://developers.cloudflare.com/pages/)
3. Проверьте логи в Dashboard → Pages → вашпроект → Functions