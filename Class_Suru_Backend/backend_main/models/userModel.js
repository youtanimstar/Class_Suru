import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// Create a new PostgreSQL connection pool
const pool = new pg.Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  max: 20,  
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

// Test the database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error acquiring client", err.stack);
    throw new Error("Database connection error");
  } else {
    console.log("Database connected successfully");
    release();
  }
});

const keepAliveQuery = async() => {
  try {
    await pool.query("SELECT 1");
    // console.log('Database is alive');
    
  } catch (err) {
    console.error("Error pinging database:", err.stack);
  }
};

// Set an interval to run the keep-alive query every 5 minutes (300000 milliseconds)
setInterval(keepAliveQuery, 300);

// Create a new user
const createUser = async (email, username, hashedPassword, phoneNumber) => {
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, password, phone_number) VALUES ($1, $2, $3, $4) RETURNING id",
      [username, email, hashedPassword, phoneNumber]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Database error (createUser):", error);
    throw new Error("Database error");
  }
};

// Find user by email
const findUserByEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
  } catch (error) {
    console.error("Database error (findUserByEmail):", error);
    throw new Error("Database error");
  }
};

// Find user by ID
const findUserById = async (userId) => {
  try {
    const result = await pool.query("SELECT id, name, email, phone_number FROM users WHERE id = $1", [userId]);
    return result.rows[0];
  } catch (error) {
    console.error("Database error (findUserById):", error);
    throw new Error("Database error");
  }
};

// Update user details
const updateUserDetail = async (userId, exam, userClass, favouriteSubject) => {
  try {
    const result = await pool.query(
      "UPDATE users SET exam_for = $1, class = $2, favourite_subject = $3 WHERE id = $4 RETURNING *",
      [exam, userClass, favouriteSubject, userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Database error (updateUserDetail):", error);
    throw new Error("Database error");
  }
};

// Store reset token and expiry time
const storeResetToken = async (email, token) => {
  try {
    await pool.query(
      "UPDATE users SET reset_token = $1, reset_token_expiry = NOW() + INTERVAL '1 hour' WHERE email = $2",
      [token, email]
    );
  } catch (error) {
    console.error("Database error (storeResetToken):", error);
    throw new Error("Database error");
  }
};

// Retrieve user by reset token
const getUserByResetToken = async (email, token) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND reset_token = $2 AND reset_token_expiry > NOW()",
      [email, token]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Database error (getUserByResetToken):", error);
    throw new Error("Database error");
  }
};

// Update user password and clear reset token
const updateUserPassword = async (email, newPassword) => {
  try {
    await pool.query(
      "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE email = $2",
      [newPassword, email]
    );
  } catch (error) {
    console.error("Database error (updateUserPassword):", error);
    throw new Error("Database error");
  }
};

const getAllUsers = async () => {
  try {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  } catch (error) {
    console.error("Database error (getAllUsers):", error);
    throw new Error("Database error");
  }
}

export { 
  pool,
  createUser, 
  findUserByEmail, 
  findUserById, 
  updateUserDetail, 
  storeResetToken, 
  getUserByResetToken, 
  updateUserPassword,
  getAllUsers
};
