FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
# Добавляем executable права для gradlew
RUN chmod +x ./gradlew
# Собираем без тестов
RUN ./gradlew clean build -x test

FROM eclipse-temurin:21-jdk
WORKDIR /app
# Устанавливаем curl для healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]