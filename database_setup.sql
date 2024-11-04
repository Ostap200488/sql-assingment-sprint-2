
-- Table for storing movie information
CREATE TABLE IF NOT EXISTS Film (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_year INT,
    category VARCHAR(100),
    director_name VARCHAR(255)
);

-- Table for storing customer information
CREATE TABLE IF NOT EXISTS Client (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email_address VARCHAR(255) UNIQUE NOT NULL,
    contact_number TEXT
);

-- Table for tracking rentals
CREATE TABLE IF NOT EXISTS RentalLog (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES Client(id),
    film_id INT REFERENCES Film(id),
    date_rented DATE NOT NULL,
    date_due DATE
);

-- Insert movie entries
INSERT INTO Film (title, release_year, category, director_name) VALUES
('Interstellar', 2014, 'Science Fiction', 'Christopher Nolan'),
('Pulp Fiction', 1994, 'Crime', 'Quentin Tarantino'),
('The Shawshank Redemption', 1994, 'Drama', 'Frank Darabont'),
('The Dark Knight', 2008, 'Action', 'Christopher Nolan'),
('Forrest Gump', 1994, 'Drama', 'Robert Zemeckis');

-- Insert customer entries
INSERT INTO Client (first_name, last_name, email_address, contact_number) VALUES
('Michael', 'Scott', 'm.scott@example.com', '111-222-3333'),
('Pam', 'Beesly', 'pam@example.com', '222-333-4444'),
('Jim', 'Halpert', 'jim@example.com', '333-444-5555'),
('Dwight', 'Schrute', 'dwight@example.com', '444-555-6666'),
('Ryan', 'Howard', 'ryan@example.com', '555-666-7777');

-- Insert rental entries
INSERT INTO RentalLog (client_id, film_id, date_rented, date_due) VALUES
(1, 1, '2024-02-01', '2024-02-08'),
(2, 2, '2024-02-02', NULL), -- currently rented
(3, 3, '2024-02-03', '2024-02-10'),
(4, 4, '2024-02-04', NULL), -- currently rented
(5, 5, '2024-02-05', '2024-02-12');
