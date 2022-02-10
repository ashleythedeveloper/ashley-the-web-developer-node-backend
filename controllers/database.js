const dotenv = require('dotenv').config();
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const pool = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  database: process.env.DBDATABASE,
  password: process.env.DBPASSWORD,
  port: process.env.DBPORT,
  ssl: {
    rejectUnauthorized: false,
    ca: fs.readFileSync(path.join(__dirname, '../ca-crt.crt')).toString()
  }
});

exports.SaveUser = async (userName, firstName, lastName, email, hashedPassword) => {
  const query = await pool.query('INSERT INTO users (user_name, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5);', [userName, firstName, lastName, email, hashedPassword])
    .then(() => {
      return { status: "User Saved", message: "User successfully created" };
    })
    .catch((err) => {
      if (err.message === 'duplicate key value violates unique constraint "users_email_key"') {
        return { status: "User Exists", field: "Email", message: "An account with this email already exists." }
      } else if (err.message === 'duplicate key value violates unique constraint "users_user_name-key"') {
        return { status: "User Exists", field: "Username", message: "An account with this username already exists. Please choose another." }
      } else {
        return { status: "Database Error", message: "There has been an error creating your account. Please try again. If the problem persists, please contact support" }
      }
    })
  return query
};

exports.GetUser = async (email) => {
  const query = await pool.query('SELECT * FROM users WHERE email=$1', [email])
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err
    })
  return query
};

exports.getMetaData = async (location) => {
  const query = await pool.query('SELECT * FROM page_metadata WHERE page=$1;', [location]);
  return query.rows[0];
}