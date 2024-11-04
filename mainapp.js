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
  const filmTable = `
    CREATE TABLE IF NOT EXISTS Film (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      release_year INT,
      category VARCHAR(100),
      director_name VARCHAR(255)
    );
  `;
  
  await dbPool.query(filmTable);
  console.log("Tables are initialized.");
}

// Function to add a new movie
async function addMovie(title, year, genre, director) {
  const insertQuery = `
    INSERT INTO Film (title, release_year, category, director_name)
    VALUES ($1, $2, $3, $4)
  `;
  await dbPool.query(insertQuery, [title, year, genre, director]);
  console.log(`Added movie: ${title}`);
}

// Function to show all movies
async function showMovies() {
  const result = await dbPool.query("SELECT * FROM Film");
  console.log("Movies:");
  result.rows.forEach((movie) => {
    console.log(`- ${movie.title} (${movie.release_year}), Genre: ${movie.category}, Director: ${movie.director_name}`);
  });
}

// Parse command line arguments
const [,, command, ...args] = process.argv;

async function main() {
  await setupTables();
  
  if (command === "add") {
    const [title, year, genre, director] = args;
    if (title && year && genre && director) {
      await addMovie(title, year, genre, director);
    } else {
      console.log("Please provide all movie details: title, year, genre, director");
    }
  } else if (command === "show") {
    await showMovies();
  } else if (command === "create") {
    console.log("Tables are already initialized.");
  } else {
    console.log("Command not recognized. Use 'add', 'show', or 'create'.");
  }

  await dbPool.end();
}

main().catch((err) => console.error("Error:", err));
