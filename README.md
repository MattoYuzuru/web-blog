<a id="readme-top"></a>

[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![project_license][license-shield]][license-url]
[![Telegram][telegram-shield]][telegram-url]

<br />
<div align="center">
  <a href="https://github.com/MattoYuzuru/web-blog">
    <img src="https://storage.yandexcloud.net/storage-for-blog/android-chrome-512x512.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Simple Web Blog</h3>

  <p align="center">
    Необычный способ делиться своей жизнью
    <br />
    <br />
    <a href="https://github.com/MattoYuzuru/web-blog">Демо</a>
    &middot;
    <a href="https://github.com/MattoYuzuru/web-blog/issues/new?labels=bug&template=bug-report---.md">Сообщить об ошибке</a>
    &middot;
    <a href="https://github.com/MattoYuzuru/web-blog/issues/new?labels=enhancement&template=feature-request---.md">Предложить улучшение</a>
  </p>
</div>


<details>
  <summary>Содержание</summary>
  <ol>
    <li>
      <a href="#о-проекте">О проекте</a>
      <ul>
        <li><a href="#построено-с">Построено с</a></li>
      </ul>
    </li>
    <li>
      <a href="#предварительные-действия">Предварительные действия</a>
    </li>
    <li><a href="#деплой-через-github-actions">Деплой через GitHub Actions</a></li>
    <li><a href="#использование">Использование</a></li>
    <li><a href="#ближайшие-таски">Ближайшие таски</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#лицензия">Лицензия</a></li>
    <li><a href="#контакты">Контакты</a></li>
  </ol>
</details>

## О проекте

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Это мой небольшой пет-проект на **Spring Boot + Next.js**. Веб-приложение с функционалом блога.  
Стараюсь соблюдать нормальную структуру кода, использую GitHub Projects (Kanban) и сделал CI/CD через GitHub Actions.

<p align="right">(<a href="#readme-top">наверх</a>)</p>

### Построено с

* [![Docker][Docker]][Docker-url]
* [![Spring Boot][Spring-Boot]][Spring-url]
* [![Postgres][Postgres]][Postgres-url]
* [![GitHub Actions][Actions]][Actions-url]
* [![Gradle][Gradle]][Gradle-url]
* [![Nginx][Nginx]][Nginx-url]
* [![JWT][JWT]][JWT-url]
* [![REST API][REST]][REST-url]
* [![Next][Next.js]][Next-url]

<p align="right">(<a href="#readme-top">наверх</a>)</p>

## Предварительные действия

Перед тем как использовать проект, нужно собрать `.env`, он должен лежать на уровне с `README.md`:

```env
# DATABASE SETUP
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_DB=db_name

# JWT TOKEN FOR AUTH
JWT_EXPIRATION=5184000000
JWT_SECRET=secret

# LINK FOR THE FRONTEND
NEXT_PUBLIC_API_URL=https://example.com

# Yandex Cloud S3 Secrets 
AWS_REGION=ru-central1
AWS_ACCESS_KEY_ID=key_id
AWS_SECRET_ACCESS_KEY=access_key
AWS_BUCKET_NAME=storage_name
```

Сгенерировать JWT секрет можно так:

```bash

openssl rand -base64 32
# или
head -c 32 /dev/urandom | base64
```

Для получения S3 секретов зарегистрируйтесь в Yandex Cloud.

Также можно изменить `create_tables.sql`, чтобы задать данные для первого пользователя. Хеш пароля можно сгенерировать
через
[BCrypt](https://bcrypt-generator.com/).

<p align="right">(<a href="#readme-top">наверх</a>)</p>

## Деплой через Github Actions

1. После форка введите все ключи в Secrets приватного репозитория.
2. Запуште проект с добавленными `.env` и другими файлами.

<p align="right">(<a href="#readme-top">наверх</a>)</p>

## Использование

### Как Пользователь

* Доступны все статьи на сайте, разделы «О сайте» и «Политика конфиденциальности».

* Поиск статей по ключевым словам.

* Две темы: светлая и тёмная.

### Как Автор

* Доступен весь функционал пользователя.

* После авторизации можно писать статьи.

<p align="right">(<a href="#readme-top">наверх</a>)</p>

## Ближайшие таски

- [ ] Добавить кэширование недописанной статьи
- [ ] Сделать высокое покрытие тестами
- [ ] Убрать лишнее логирование в консоль браузера
- [ ] Добавить мониторинг на машину
- [ ] Сделать минимальную защиту от DDoS
- [ ] Добавить страницу с минимальной аналитикой
- [ ] Добавить поддержку английского языка

Все ишьюсы: [issues](https://github.com/MattoYuzuru/web-blog/issues).

Канбан: [projects/3](https://github.com/users/MattoYuzuru/projects/3)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Если у вас есть предложение по улучшению, пожалуйста, сделайте форк и Pull Request.
Или создайте задачу с тегом enhancement.

Не забудьте поставить звёздочку ⭐ проекту!

<p align="right">(<a href="#readme-top">наверх</a>)</p>

## Лицензия

Распространяется по лицензии Apache License V2. Подробнее см. в `LICENSE`.

<p align="right">(<a href="#readme-top">наверх</a>)</p>

## Контакты

Матвей Рябушкин - [@Keyko_Mi](https://t.me/Keyko_Mi) - matveyryabushkin@gmail.com

Ссылка на проект: [https://github.com/MattoYuzuru/web-blog](https://github.com/MattoYuzuru/web-blog)

<p align="right">(<a href="#readme-top">наверх</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- LINKS & IMAGES -->

[stars-shield]: https://img.shields.io/github/stars/MattoYuzuru/web-blog.svg?style=for-the-badge

[stars-url]: https://github.com/MattoYuzuru/web-blog/stargazers

[issues-shield]: https://img.shields.io/github/issues/MattoYuzuru/web-blog.svg?style=for-the-badge

[issues-url]: https://github.com/MattoYuzuru/web-blog/issues

[license-shield]: https://img.shields.io/github/license/MattoYuzuru/web-blog.svg?style=for-the-badge

[license-url]: https://github.com/MattoYuzuru/web-blog/blob/master/LICENSE

[telegram-shield]: https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white

[telegram-url]: https://t.me/Keyko_Mi

[product-screenshot]: https://storage.yandexcloud.net/storage-for-blog/articles/1757947844-d98d78ba-bc17-49d4-8569-5e51cf6a0eb2.png

[Next.js]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white

[Next-url]: https://nextjs.org/

[Docker]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white

[Docker-url]: https://www.docker.com/

[Spring-Boot]: https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white

[Spring-url]: https://spring.io/projects/spring-boot

[Postgres]: https://img.shields.io/badge/Postgres-316192?style=for-the-badge&logo=postgresql&logoColor=white

[Postgres-url]: https://www.postgresql.org/

[Actions]: https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white

[Actions-url]: https://github.com/features/actions

[Gradle]: https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white

[Gradle-url]: https://gradle.org/

[Nginx]: https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white

[Nginx-url]: https://nginx.org/

[JWT]: https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white

[JWT-url]: https://jwt.io/

[REST]: https://img.shields.io/badge/REST-02569B?style=for-the-badge&logo=rest&logoColor=white

[REST-url]: https://restfulapi.net/
