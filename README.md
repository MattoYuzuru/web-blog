<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
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
    Необычный способ делится своей жизнью
    <br />
    <br />
    <a href="https://github.com/MattoYuzuru/web-blog">View Demo</a>
    &middot;
    <a href="https://github.com/MattoYuzuru/web-blog/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/MattoYuzuru/web-blog/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>


<details>
  <summary>Содержание</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## О проекте

[![Product Name Screen Shot][product-screenshot]](https://example.com)


Это мой небольшой пет-проект на Spring + NextJS. Веб приложение с функционалом блога.

Постарался сделать всё по стандартам, веду репо, делаю таски в GH Projects Kanban, стараюсь соблюдать нормальную структуру кода (не без LLM), сделал удобный CI/CD через GH Actions.


<p align="right">(<a href="#readme-top">back to top</a>)</p>



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


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Предварительные действия

Перед тем как использовать проект, нужно собрать `.env`, он должен лежать на уровне с `README.md`
```.env
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

Для генерации JWT токена можете воспользоваться командой 
```bash

openssl rand -base64 32
# или
head -c 32 /dev/urandom | base64
```
Для получения S3 секретов зарегистрируйтесь на YC по гайдам в интернете. 

Также можете сразу поменять `create_tables.sql`, для первого юзера ввести все нужные данные, 
сгенерить хеш можно на [BCrypt](https://bcrypt-generator.com/).


## Деплой через Github Actions

1. После форка введите все ключи в раздел секретов приватного репозитория.
2. Запуште проект с добавленными `.env` и другими файлами.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Использование

### Как Пользователь:
Регистрация не доступна напрямую. Пользователь имеет доступ ко всем статьям на сайте, разделам "О Сайте", "Политика Конфидециальности", 
впрочем, в настоящее время сайт не собирает никаких чувствительных данных.

Используя строку поиска, можно искать статьи по ключевым словам в тексте статьи или названии.

На сайте представлены две темы, светлая и темная. 

### Как Автор:
Доступен тот же функционал, как и рядовому пользователю, но после авторизации можно начать писать свои статьи.


<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Ближайшие таски

- [ ] Добавить кэширование недописанной статьи
- [ ] Сделать высокое покрытие тестами
- [ ] Убрать лишнее логирование в консоль браузера
- [ ] Добавить мониторинг на машину
- [ ] Сделать минимальную защиту от DDoS
- [ ] Добавить страницу с минимальной аналитикой 
- [ ] Добавить поддержку английского языка

Все ишьюсы можно посмотреть [тут](https://github.com/MattoYuzuru/web-blog/issues).
Посмотреть канбан доску можно [тут](https://github.com/users/MattoYuzuru/projects/3)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Contributing

Если у вас есть предложение по улучшению, пожалуйста, сделайте форк репозитория и создайте запрос на извлечение. Вы также можете просто создать задачу с тегом «enhancement».

Не забудьте поставить проекту звездочку! Ещё раз спасибо!

1. Форкните проект
2. Сделайте ветку с фичей (`git checkout -b feature/GoodFeature`)
3. Сделайте коммит (`git commit -m 'Add some GoodFeature'`)
4. Сделайте пуш в вашу ветку (`git push origin feature/GoodFeature`)
5. Откройте PR

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Лицензия

Распространяется по лицензии Apache License V2. Подробнее см. в `LICENSE`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Контакты

Матвей Рябушкин - [@Keyko_Mi](https://t.me/Keyko_Mi) - matveyryabushkin@gmail.com

Ссылка на проект: [https://github.com/MattoYuzuru/web-blog](https://github.com/MattoYuzuru/web-blog)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[telegram-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://t.me/Keyko_Mi
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com

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
