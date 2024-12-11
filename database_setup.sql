-- Table for storing movie information
CREATE TABLE IF NOT EXISTS Film (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_year INT,
    category VARCHAR(100),
    director_name VARCHAR(255)
);

-- Adding an index on the title for faster searches
CREATE INDEX IF NOT EXISTS idx_film_title ON Film(title);

-- Table for storing customer information
CREATE TABLE IF NOT EXISTS Client (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email_address VARCHAR(255) UNIQUE NOT NULL,
    contact_number TEXT
);

-- Adding an index on the email address for faster lookups
CREATE INDEX IF NOT EXISTS idx_client_email ON Client(email_address);

-- Table for storing rental information
CREATE TABLE IF NOT EXISTS Rental (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES Client(id) ON DELETE CASCADE,
    film_id INT REFERENCES Film(id) ON DELETE CASCADE,
    rental_date DATE NOT NULL,
    return_date DATE,
    CHECK (return_date >= rental_date)
);
