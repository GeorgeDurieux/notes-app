# Notes App

A simple notes application to create, manage, and store notes efficiently.

## Features

- Create, edit, and delete notes
- Save notes persistently
- User-friendly interface
- Lightweight and fast

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Version Control:** Git, GitHub

## Installation

1. Clone the repository:

git clone https://github.com/GeorgeDurieux/notes-app.git

2. Navigate to the project directory:

cd notes-app

## Database Setup

To set up the PostgreSQL database, follow these steps:

1. Ensure you have PostgreSQL installed and running.

2. Open a PostgreSQL terminal or pgAdmin query editor.

3. Run the following command to create the database (if not already created):

CREATE DATABASE notepad;

4. Run the database.sql script to create the required tables:

-- Inside PostgreSQL or pgAdmin, execute:

\\c notepad -- Connect to the database

-- Run the database.sql script (adjust path as needed):


-- If using psql from terminal:
\i path/to/sql/database.sql

## Usage

1. Open the project folder in your preferred editor.
2. Run the application as per the project setup.
3. Start taking notes!

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
