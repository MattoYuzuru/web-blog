-- Таблица пользователей
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       mail VARCHAR(100) NOT NULL UNIQUE,
                       hashed_password VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица статей
CREATE TABLE articles (
                          id SERIAL PRIMARY KEY,
                          title VARCHAR(255) NOT NULL,
                          content TEXT NOT NULL,
                          read_count INTEGER DEFAULT 0,
                          published_at TIMESTAMP WITH TIME ZONE,
                          image_url VARCHAR(500)
);

INSERT INTO users (username, mail, hashed_password, created_at)
VALUES ('admin', 'admin@example.com', 'hashed_password', NOW());