DROP TABLE IF EXISTS images CASCADE;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    tags TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
        id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL,
        comment VARCHAR NOT NULL,
        image_id INT NOT NULL REFERENCES images(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );