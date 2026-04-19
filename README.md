# BookHub

BookHub — веб-приложение онлайн-библиотеки на `Django REST Framework` и `React`.

Пользователь может просматривать каталог книг, читать их во встроенной читалке, сохранять в избранное, оставлять отзывы, редактировать профиль и восстанавливать доступ к аккаунту.

## Стек

- Python
- Django
- Django REST Framework
- Simple JWT
- React
- Vite
- Axios
- SQLite
- PostgreSQL
- Docker

## Возможности

- регистрация и вход
- каталог книг
- поиск и фильтрация
- избранное
- отзывы и оценки
- встроенная читалка
- сохранение прогресса чтения
- редактирование профиля
- восстановление пароля
- административная панель Django

## Запуск локально

Установить backend-зависимости:

```bash
pip install -r requirements.txt
```

Установить frontend-зависимости:

```bash
cd my-react-app
npm install
```

Запустить backend:

```bash
python manage.py migrate
python manage.py runserver
```

Запустить frontend:

```bash
cd my-react-app
npm run dev
```

После запуска:

- frontend: `http://127.0.0.1:5173`
- backend: `http://127.0.0.1:8000`

## Проверка

```bash
python manage.py check
python manage.py test
cd my-react-app && npm run build
```
