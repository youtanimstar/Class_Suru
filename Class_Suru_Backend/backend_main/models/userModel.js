import pg from "pg";
import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";
import process from "process";

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
  connectionTimeoutMillis: 5000,
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const connectPool = async () => {
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
};

connectPool();

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  connectPool();
});

// const keepAliveQuery = async() => {
//   try {
//     await pool.query("SELECT 1");
//     // console.log('Database is alive');

//   } catch (err) {
//     console.error("Error pinging database:", err.stack);
//   }
// };

// // Set an interval to run the keep-alive query every 5 minutes (300000 milliseconds)
// setInterval(keepAliveQuery, 300);

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
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Database error (findUserByEmail):", error);
    throw new Error("Database error");
  }
};

// Find user by ID
const findUserById = async (userId) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Database error (findUserById):", error);
    throw new Error("Database error");
  }
};

// Update user details
const addUserDetail = async (userId, exam, userClass, favouriteSubject) => {
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
};

const findAdminByEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM admin WHERE email = $1", [
      email,
    ]);
    const otp = crypto.randomInt(100000, 999999).toString();

    await pool.query(
      "UPDATE admin SET otp = $1, otp_expiry = NOW() + INTERVAL '5 minutes' WHERE email = $2",
      [otp, email]
    );

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Admin Login OTP",
      html: `
      <div style="text-align: center;">
        <img src="https://class-suru.vercel.app/assets/class_suru_logo-wIYO1Yaf.png" alt="Banner" style="width: 100%; max-width: 200px;margin:0 auto;"/>
        <h2>Admin Login OTP</h2>
        <p>Dear Admin,</p>
        <p>Your One-Time Password (OTP) for admin login is:</p>
        <h3 style="font-size: 24px; color: #504eec;">${otp}</h3>
        <p>This OTP is valid for 5 minutes. Please do not share this OTP with anyone.</p>
        <p>Thank you,</p>
        <p>Class Suru Team</p>
      </div>
      `,
    });
    return result.rows[0];
  } catch (error) {
    console.error("Database error (findAdminByEmail):", error);
    throw new Error("Database error");
  }
};

const verifyAdminOTP = async (email, otp) => {
  try {
    const result = await pool.query(
      "SELECT * FROM admin WHERE email = $1 AND otp = $2 AND otp_expiry > NOW()",
      [email, otp]
    );

    if (result.rows.length === 0) {
      throw new Error("OTP expired");
    }

    return result.rows[0];
  } catch (error) {
    console.error("Database error (checkAdminOTP):", error);
    throw new Error(error.message || "Database error");
  }
};

const updateUserDetails = async (userId, updates) => {
  try {
    if (!updates) {
      throw new Error("Some update field required");
    }

    const fields = Object.keys(updates);
    if (fields.length === 0) {
      throw new Error("No fields to update");
    }
    const values = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(", ");
    const query = `UPDATE users SET ${values} WHERE id = $1 RETURNING *`;

    const result = await pool.query(query, [
      userId,
      ...fields.map((field) => updates[field]),
    ]);

    return result.rows[0] || null;
  } catch (error) {
    console.error("Database error (updateUserDetails):", error);
    throw new Error("Database error");
  }
};

export {
  pool,
  createUser,
  findUserByEmail,
  findUserById,
  addUserDetail,
  storeResetToken,
  getUserByResetToken,
  updateUserPassword,
  getAllUsers,
  findAdminByEmail,
  verifyAdminOTP,
  updateUserDetails
};
