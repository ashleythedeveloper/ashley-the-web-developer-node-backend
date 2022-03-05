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
      return {
        status: "User Saved",
        errorField: "",
        messageType: "",
        messageTitle: "",
        message: "Your account has been successfully created"
      };
    })
    .catch((err) => {
      if (err.message === 'duplicate key value violates unique constraint "users_email_key"') {
        return {
          status: "User Exists",
          errorField: "Email",
          messageType: "error",
          messageTitle: "Error",
          message: "An account with this email address already exists. Please login."
        }
      } else if (err.message === 'duplicate key value violates unique constraint "users_user_name-key"') {
        return {
          status: "User Exists",
          errorField: "Username",
          messageType: "error",
          messageTitle: "Error",
          message: "An account with this username already exists. Please choose another."
        }
      } else {
        return {
          status: "Database Error",
          errorField: "",
          messageType: "error",
          messageTitle: "Error",
          message: "There has been an error creating your account. Please try again. If the problem persists, please contact support."
        }
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
};

exports.BlacklistJWTToken = async (JWTToken) => {
  const date = new Date();
  const timestamp = date.toISOString();
  const query = await pool.query('INSERT INTO jwt_token_blacklist (token, created_at) VALUES ($1, $2);', [JWTToken, timestamp])
  .then((res) => {
    return res
  })
  .catch((err) => {
    return err
  })
  return query
};

exports.CheckBlackListedToken = async (token) => {
  const query = await pool.query('SELECT * FROM jwt_token_blacklist WHERE token=$1;', [token])
  .then((res) => {
    return res.rows
  })
  .catch((err) => {
    return err
  })

  return query
}

exports.SaveIPAddress = async (ip, email) => {
  const date = new Date();
  const timestamp = date.toISOString();

  const query = await pool.query('INSERT INTO ip_addresses (ip_address, time, email) VALUES ($1, $2, $3);', [ip, timestamp, email])
  .then((res) => {
    return res
  })
  .catch((err) => {
    return err
  })
  return query
}