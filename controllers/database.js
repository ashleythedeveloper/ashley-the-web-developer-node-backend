const dotenv = require("dotenv").config();
const { Pool } = require("pg");
const path = require("path");
const fs = require("fs");

const pool = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  database: process.env.DBDATABASE,
  password: process.env.DBPASSWORD,
  port: process.env.DBPORT,
  ssl: {
    rejectUnauthorized: false,
    ca: fs.readFileSync(path.join(__dirname, "../ca-crt.crt")).toString(),
  },
});

exports.Pool = pool;

exports.SaveUser = async (
  userName,
  firstName,
  lastName,
  email,
  hashedPassword
) => {
  const query = await pool
    .query(
      'INSERT INTO "users" ("user_name", "first_name", "last_name", "email", "password") VALUES ($1, $2, $3, $4, $5);',
      [userName, firstName, lastName, email, hashedPassword]
    )
    .then(() => {
      return {
        status: "User Saved",
        errorField: "",
        messageType: "",
        messageTitle: "",
        message: "Your account has been successfully created",
      };
    })
    .catch((err) => {
      if (
        err.message ===
        'duplicate key value violates unique constraint "users_email_key"'
      ) {
        return {
          status: "User Exists",
          errorField: "Email",
          messageType: "error",
          messageTitle: "Error",
          message:
            "An account with this email address already exists. Please login.",
        };
      } else if (
        err.message ===
        'duplicate key value violates unique constraint "users_user_name-key"'
      ) {
        return {
          status: "User Exists",
          errorField: "Username",
          messageType: "error",
          messageTitle: "Error",
          message:
            "An account with this username already exists. Please choose another.",
        };
      } else {
        return {
          status: "Database Error",
          errorField: "",
          messageType: "error",
          messageTitle: "Error",
          message:
            "There has been an error creating your account. Please try again. If the problem persists, please contact support.",
        };
      }
    });
  return query;
};

exports.GetUser = async (email) => {
  const query = await pool
    .query("SELECT * FROM users WHERE email=$1", [email])
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  return query;
};

exports.getMetaData = async (location) => {
  const query = await pool.query("SELECT * FROM page_metadata WHERE page=$1;", [
    location,
  ]);
  return query.rows[0];
};

exports.BlacklistJWTToken = async (JWTToken) => {
  const date = new Date();
  const timestamp = date.toISOString();
  const query = await pool
    .query(
      "INSERT INTO jwt_token_blacklist (token, created_at) VALUES ($1, $2);",
      [JWTToken, timestamp]
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  return query;
};

exports.CheckBlackListedToken = async (token) => {
  const query = await pool
    .query("SELECT * FROM jwt_token_blacklist WHERE token=$1;", [token])
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      return err;
    });

  return query;
};

exports.SaveIPAddress = async (ip, email) => {
  const date = new Date();
  const timestamp = date.toISOString();

  const query = await pool
    .query(
      "INSERT INTO ip_addresses (ip_address, time, email) VALUES ($1, $2, $3);",
      [ip, timestamp, email]
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  return query;
};

exports.GetAllProjects = async () => {
  const query = await pool
    .query("SELECT * FROM project_data;")
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      return err;
    });
  return query;
};

exports.GetProject = async (slug) => {
  const query = await pool
    .query("SELECT * FROM project_data WHERE slug=$1;", [slug])
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      return err;
    });
  return query;
};

exports.GetProjectImages = async (projectId) => {
  const query = await pool
    .query("SELECT * FROM project_images WHERE project=$1;", [projectId])
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      return err;
    });
  return query;
};

exports.GetProjectTechStack = async (projectId) => {
  const query = await pool
    .query(
      "SELECT project_tech.id, technologies.tech_name FROM technologies INNER JOIN project_tech ON project_tech.tech=technologies.id WHERE project_tech.project=$1;",
      [projectId]
    )
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      return err;
    });
  return query;
};

exports.UpdateProjectData = async (modifiedProjectData) => {
  const query = await pool.query(
    "UPDATE project_data SET content = $1, core_tech = $2, date_published = $3, description = $4, main_project_image = $5, meta_description = $6, meta_title = $7, project_link = $8, project_repo= $9, project_title = $10, published = $11, slug = $12 WHERE id=$13;",
    [
      modifiedProjectData.content,
      modifiedProjectData.core_tech,
      modifiedProjectData.date_published,
      modifiedProjectData.description,
      modifiedProjectData.main_project_image,
      modifiedProjectData.meta_description,
      modifiedProjectData.meta_title,
      modifiedProjectData.project_link,
      modifiedProjectData.project_repo,
      modifiedProjectData.project_title,
      modifiedProjectData.published,
      modifiedProjectData.slug,
      modifiedProjectData.id,
    ]
  );
  return query;
};

exports.RemoveTechFromProject = async (techObjectToRemove) => {
  const query = await pool.query("DELETE FROM project_tech WHERE id=$1", [
    techObjectToRemove.id,
  ]);
  return query;
};

exports.CheckOwnershipOfProject = async (userId, projectId) => {
  const query = await pool.query(
    'SELECT * FROM projects WHERE "user"=$1 AND "project"=$2;',
    [userId, projectId]
  );
  return query;
};
