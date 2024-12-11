// Updated mainapp.js
const { Pool } = require("pg");
const dbPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to create tables
async function setupTables() {
  try {
    const filmTable = `
      CREATE TABLE IF NOT EXISTS Film (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        release_year INT,
        category VARCHAR(100),
        director_name VARCHAR(255)
      );
      CREATE INDEX IF NOT EXISTS idx_film_title ON Film(title);
    `;
    const clientTable = `
      CREATE TABLE IF NOT EXISTS Client (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email_address VARCHAR(255) UNIQUE NOT NULL,
        contact_number TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_client_email ON Client(email_address);
    `;
    const rentalTable = `
      CREATE TABLE IF NOT EXISTS Rental (
        id SERIAL PRIMARY KEY,
        client_id INT REFERENCES Client(id) ON DELETE CASCADE,
        film_id INT REFERENCES Film(id) ON DELETE CASCADE,
        rental_date DATE NOT NULL,
        return_date DATE,
        CHECK (return_date >= rental_date)
      );
    `;

    await dbPool.query(filmTable);
    await dbPool.query(clientTable);
    await dbPool.query(rentalTable);

    console.log("Tables created successfully!");
  } catch (err) {
    console.error("Error setting up tables:", err);
  }
}

// Function to insert sample data
async function insertSampleData() {
  try {
    const movies = [
      ["Inception", 2010, "Sci-Fi", "Christopher Nolan"],
      ["The Godfather", 1972, "Crime", "Francis Ford Coppola"],
      ["The Dark Knight", 2008, "Action", "Christopher Nolan"],
      ["Pulp Fiction", 1994, "Crime", "Quentin Tarantino"],
      ["The Matrix", 1999, "Sci-Fi", "Lana Wachowski"]
    ];
    const customers = [
      ["John", "Doe", "john.doe@example.com", "1234567890"],
      ["Jane", "Smith", "jane.smith@example.com", "0987654321"],
      ["Alice", "Brown", "alice.brown@example.com", "1122334455"],
      ["Bob", "Johnson", "bob.johnson@example.com", "5566778899"],
      ["Charlie", "Davis", "charlie.davis@example.com", "9988776655"]
    ];
    const rentals = [
      [1, 1, "2024-12-01", null],
      [1, 2, "2024-12-02", "2024-12-05"],
      [2, 3, "2024-12-03", "2024-12-04"],
      [3, 4, "2024-12-04", null],
      [3, 5, "2024-12-05", null],
      [4, 2, "2024-12-06", "2024-12-07"],
      [5, 1, "2024-12-07", null],
      [5, 3, "2024-12-08", "2024-12-10"],
      [2, 4, "2024-12-09", null],
      [4, 5, "2024-12-10", null]
    ];

    for (const movie of movies) {
      await dbPool.query(
        "INSERT INTO Film (title, release_year, category, director_name) VALUES ($1, $2, $3, $4);",
        movie
      );
    }

    for (const customer of customers) {
      await dbPool.query(
        "INSERT INTO Client (first_name, last_name, email_address, contact_number) VALUES ($1, $2, $3, $4);",
        customer
      );
    }

    for (const rental of rentals) {
      await dbPool.query(
        "INSERT INTO Rental (film_id, client_id, rental_date, return_date) VALUES ($1, $2, $3, $4);",
        rental
      );
    }

    console.log("Sample data inserted successfully!");
  } catch (err) {
    console.error("Error inserting sample data:", err);
  }
}

// Function to find movies rented by a specific customer
async function findMoviesByCustomer(email) {
  try {
    const res = await dbPool.query(
      `SELECT F.title, F.release_year, F.category, F.director_name
       FROM Rental R
       JOIN Film F ON R.film_id = F.id
       JOIN Client C ON R.client_id = C.id
       WHERE C.email_address = $1;`,
      [email]
    );
    if (res.rows.length > 0) {
      console.table(res.rows);
    } else {
      console.log("No movies found for this customer.");
    }
  } catch (err) {
    console.error("Error finding movies by customer:", err);
  }
}

// Function to show all movies
async function showMovies() {
  try {
    const res = await dbPool.query("SELECT * FROM Film;");
    if (res.rows.length > 0) {
      console.table(res.rows);
    } else {
      console.log("No movies found in the database.");
    }
  } catch (err) {
    console.error("Error showing movies:", err);
  }
}

// Function to remove a customer and their rental history
async function removeCustomer(clientId) {
  try {
    const res = await dbPool.query("DELETE FROM Client WHERE id = $1 RETURNING *;", [clientId]);
    if (res.rowCount > 0) {
      console.log(`Customer with ID ${clientId} and their rental history have been removed.`);
    } else {
      console.log("No customer found with the given ID.");
    }
  } catch (err) {
    console.error("Error removing customer:", err);
  }
}

// CLI functionality
const args = process.argv.slice(2);
(async () => {
  switch (args[0]) {
    case "setup":
      await setupTables();
      break;
    case "insert-sample":
      await insertSampleData();
      break;
    case "show-movies":
      await showMovies();
      break;
    case "update-email":
      if (args[1] && args[2]) {
        await dbPool.query(
          "UPDATE Client SET email_address = $1 WHERE id = $2;",
          [args[2], args[1]]
        );
        console.log("Email updated successfully.");
      } else {
        console.log("Usage: update-email <clientId> <newEmail>");
      }
      break;
    case "find-movies-by-customer":
      if (args[1]) {
        await findMoviesByCustomer(args[1]);
      } else {
        console.log("Usage: find-movies-by-customer <email>");
      }
      break;
    case "remove-customer":
      if (args[1]) {
        await removeCustomer(args[1]);
      } else {
        console.log("Usage: remove-customer <clientId>");
      }
      break;
    default:
      console.log("Invalid command. Available commands: setup, insert-sample, show-movies, update-email, find-movies-by-customer, remove-customer.");
  }
  dbPool.end();
})();
