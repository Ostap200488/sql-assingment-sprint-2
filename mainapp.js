
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
    console.log("Tables setup completed.");
  } catch (err) {
    console.error("Error setting up tables:", err);
  }
}

// Function to display all movies
async function showAllMovies() {
  try {
    const result = await dbPool.query("SELECT * FROM Film;");
    console.log("Movies in the system:");
    result.rows.forEach((movie) => {
      console.log(`${movie.id}. ${movie.title} (${movie.release_year}) - ${movie.category}, Directed by ${movie.director_name}`);
    });
  } catch (err) {
    console.error("Error fetching movies:", err);
  }
}

// Function to add a new movie
async function addMovie(title, releaseYear, category, directorName) {
  try {
    const query = `
      INSERT INTO Film (title, release_year, category, director_name)
      VALUES ($1, $2, $3, $4) RETURNING id;
    `;
    const values = [title, releaseYear, category, directorName];
    const result = await dbPool.query(query, values);
    console.log(`Movie added with ID: ${result.rows[0].id}`);
  } catch (err) {
    console.error("Error adding movie:", err);
  }
}

// Function to update customer email
async function updateCustomerEmail(customerId, newEmail) {
  try {
    const query = "UPDATE Client SET email_address = $1 WHERE id = $2;";
    const values = [newEmail, customerId];
    await dbPool.query(query, values);
    console.log(`Customer's email updated to ${newEmail}`);
  } catch (err) {
    console.error("Error updating customer email:", err);
  }
}

// Function to remove a customer and their rental history
async function removeCustomer(customerId) {
  try {
    const query = "DELETE FROM Client WHERE id = $1;";
    await dbPool.query(query, [customerId]);
    console.log("Customer and their rental history removed.");
  } catch (err) {
    console.error("Error removing customer:", err);
  }
}

// Query: Find movies rented by a customer using their email
async function findMoviesByCustomer(email) {
  try {
    const query = `
      SELECT Film.title
      FROM Rental
      INNER JOIN Film ON Rental.film_id = Film.id
      INNER JOIN Client ON Rental.client_id = Client.id
      WHERE Client.email_address = $1;
    `;
    const result = await dbPool.query(query, [email]);
    console.log(`Movies rented by ${email}:`);
    result.rows.forEach(row => console.log(row.title));
  } catch (err) {
    console.error("Error fetching movies by customer:", err);
  }
}

// Query: Find customers by movie title
async function findCustomersByMovie(title) {
  try {
    const query = `
      SELECT Client.first_name, Client.last_name
      FROM Rental
      INNER JOIN Film ON Rental.film_id = Film.id
      INNER JOIN Client ON Rental.client_id = Client.id
      WHERE Film.title = $1;
    `;
    const result = await dbPool.query(query, [title]);
    console.log(`Customers who rented "${title}":`);
    result.rows.forEach(row => console.log(`${row.first_name} ${row.last_name}`));
  } catch (err) {
    console.error("Error fetching customers by movie:", err);
  }
}

// Query: Rental history for a specific movie
async function getRentalHistory(title) {
  try {
    const query = `
      SELECT Rental.rental_date, Rental.return_date, Client.first_name, Client.last_name
      FROM Rental
      INNER JOIN Film ON Rental.film_id = Film.id
      INNER JOIN Client ON Rental.client_id = Client.id
      WHERE Film.title = $1;
    `;
    const result = await dbPool.query(query, [title]);
    console.log(`Rental history for "${title}":`);
    result.rows.forEach(row => console.log(`${row.rental_date} to ${row.return_date}: ${row.first_name} ${row.last_name}`));
  } catch (err) {
    console.error("Error fetching rental history:", err);
  }
}

// Query: Currently rented movies
async function listCurrentlyRentedMovies() {
  try {
    const query = `
      SELECT Film.title, Client.first_name, Client.last_name, Rental.rental_date
      FROM Rental
      INNER JOIN Film ON Rental.film_id = Film.id
      INNER JOIN Client ON Rental.client_id = Client.id
      WHERE Rental.return_date IS NULL;
    `;
    const result = await dbPool.query(query);
    console.log("Currently rented movies:");
    result.rows.forEach(row => console.log(`${row.title} rented by ${row.first_name} ${row.last_name} on ${row.rental_date}`));
  } catch (err) {
    console.error("Error fetching currently rented movies:", err);
  }
}

// Command-line arguments handling
const args = process.argv.slice(2);

(async () => {
  switch (args[0]) {
    case "setup":
      await setupTables();
      break;
    case "show":
      await showAllMovies();
      break;
    case "add":
      await addMovie(args[1], args[2], args[3], args[4]);
      break;
    case "update":
      await updateCustomerEmail(args[1], args[2]);
      break;
    case "remove":
      await removeCustomer(args[1]);
      break;
    case "find-movies":
      await findMoviesByCustomer(args[1]);
      break;
    case "find-customers":
      await findCustomersByMovie(args[1]);
      break;
    case "rental-history":
      await getRentalHistory(args[1]);
      break;
    case "currently-rented":
      await listCurrentlyRentedMovies();
      break;
    default:
      console.log("Invalid command. Use one of the following commands:");
      console.log("setup, show, add, update, remove, find-movies, find-customers, rental-history, currently-rented");
  }
  process.exit();
})();
