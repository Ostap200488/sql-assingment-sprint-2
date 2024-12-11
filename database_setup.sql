-- SQL Script for Movie Rental System

-- Create Tables
CREATE TABLE IF NOT EXISTS Film (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_year INT,
    category VARCHAR(100),
    director_name VARCHAR(255)
);
CREATE INDEX IF NOT EXISTS idx_film_title ON Film(title);

CREATE TABLE IF NOT EXISTS Client (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email_address VARCHAR(255) UNIQUE NOT NULL,
    contact_number TEXT
);
CREATE INDEX IF NOT EXISTS idx_client_email ON Client(email_address);

CREATE TABLE IF NOT EXISTS Rental (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES Client(id) ON DELETE CASCADE,
    film_id INT REFERENCES Film(id) ON DELETE CASCADE,
    rental_date DATE NOT NULL,
    return_date DATE,
    CHECK (return_date >= rental_date)
);

-- Insert Sample Data
INSERT INTO Film (title, release_year, category, director_name) VALUES
    ('Inception', 2010, 'Sci-Fi', 'Christopher Nolan'),
    ('The Godfather', 1972, 'Crime', 'Francis Ford Coppola'),
    ('The Dark Knight', 2008, 'Action', 'Christopher Nolan'),
    ('Pulp Fiction', 1994, 'Crime', 'Quentin Tarantino'),
    ('The Matrix', 1999, 'Sci-Fi', 'Lana Wachowski');

INSERT INTO Client (first_name, last_name, email_address, contact_number) VALUES
    ('John', 'Doe', 'john.doe@example.com', '1234567890'),
    ('Jane', 'Smith', 'jane.smith@example.com', '0987654321'),
    ('Alice', 'Brown', 'alice.brown@example.com', '1122334455'),
    ('Bob', 'Johnson', 'bob.johnson@example.com', '5566778899'),
    ('Charlie', 'Davis', 'charlie.davis@example.com', '9988776655');

INSERT INTO Rental (film_id, client_id, rental_date, return_date) VALUES
    (1, 1, '2024-12-01', NULL),
    (1, 2, '2024-12-02', '2024-12-05'),
    (2, 3, '2024-12-03', '2024-12-04'),
    (3, 4, '2024-12-04', NULL),
    (3, 5, '2024-12-05', NULL),
    (4, 2, '2024-12-06', '2024-12-07'),
    (5, 1, '2024-12-07', NULL),
    (5, 3, '2024-12-08', '2024-12-10'),
    (2, 4, '2024-12-09', NULL),
    (4, 5, '2024-12-10', NULL);

-- Queries

-- Find movies rented by a specific customer
SELECT F.title, F.release_year, F.category, F.director_name
FROM Rental R
JOIN Film F ON R.film_id = F.id
JOIN Client C ON R.client_id = C.id
WHERE C.email_address = 'example@example.com';

-- Find customers who rented a specific movie
SELECT C.first_name, C.last_name, C.email_address, C.contact_number
FROM Rental R
JOIN Client C ON R.client_id = C.id
JOIN Film F ON R.film_id = F.id
WHERE F.title = 'Inception';

-- Get rental history for a specific movie
SELECT C.first_name, C.last_name, R.rental_date, R.return_date
FROM Rental R
JOIN Client C ON R.client_id = C.id
JOIN Film F ON R.film_id = F.id
WHERE F.title = 'The Matrix';

-- Find rentals for a specific director's movies
SELECT C.first_name, C.last_name, R.rental_date, F.title
FROM Rental R
JOIN Client C ON R.client_id = C.id
JOIN Film F ON R.film_id = F.id
WHERE F.director_name = 'Christopher Nolan';

-- List all currently rented movies
SELECT F.title, C.first_name, C.last_name, R.rental_date
FROM Rental R
JOIN Film F ON R.film_id = F.id
JOIN Client C ON R.client_id = C.id
WHERE R.return_date IS NULL;
