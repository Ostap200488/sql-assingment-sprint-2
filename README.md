
# Movie Rental Management System

This project is a **Movie Rental System** implemented using **Node.js** and **PostgreSQL**. The application provides a command-line interface (CLI) to manage movie rentals, customers, and rental records within a PostgreSQL database.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Requirements](#requirements)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Database Setup](#database-setup)
6. [Usage](#usage)
7. [Database Schema](#database-schema)
8. [Troubleshooting](#troubleshooting)

---

## Project Structure

The project consists of the following files:

- **`movierent.js`**: A JavaScript file that connects to PostgreSQL and provides functionality for creating tables, adding movies, updating customer data, and displaying records.
- **`database_setup.sql`**: SQL script to initialize the database, create necessary tables, and insert sample data.

---


## Installation

1. **Install PostgreSQL**

   - **macOS** (using Homebrew):
     ```bash
     brew install postgresql
     brew services start postgresql
     ```

   - **Linux**:
     ```bash
     sudo apt update
     sudo apt install postgresql postgresql-contrib
     sudo systemctl start postgresql
     ```

   - For other systems, refer to [PostgreSQL documentation](https://www.postgresql.org/download/).

2. **Clone the Repository**

   Download the project files and navigate to the project directory:

   ```bash
   git clone <repository-url>
   cd sql_assignment_sprint
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

---



## Usage

The CLI supports various commands to manage movies, customers, and rentals.

1. **Create Tables** (if not already created)

   ```bash
   node movierent.js create
   ```

2. **Show All Movies**

   Displays a list of all movies in the database:

   ```bash
   node movierent.js show
   ```

3. **Add a New Movie**

   Add a movie with title, release year, genre, and director:

   ```bash
   node movierent.js add "Inception" "2010" "Science Fiction" "Christopher Nolan"
   ```

4. **Update Customer Email**

   Update a customer's email by providing their current email and the new email:

   ```bash
   node movierent.js update "old_email@example.com" "new_email@example.com"
   ```

5. **Remove a Customer**

   Remove a customer and their rental history:

   ```bash
   node movierent.js remove "customer_email@example.com"
   ```

---

## Database Schema

The system uses three main tables:

1. **Movies Table**: Stores movie details.
2. **Customers Table**: Stores customer details.
3. **Rentals Table**: Logs each rental with dates and customer/movie references.

---

## Troubleshooting

1. **Database Connection Issues**:
   - Ensure PostgreSQL is running (`brew services start postgresql` on macOS or `sudo systemctl start postgresql` on Linux).

2. **Permission Errors**:
   - Ensure your PostgreSQL user has the correct permissions for creating tables and inserting data.

---

This guide should help you set up, configure, and use the Movie Rental Management System. For any issues, feel free to reach out for further assistance.
