const pool = require("./db");

const createOtpTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS password_reset_otps (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      otp_hash VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_password_reset_user_id ON password_reset_otps(user_id);
  `;

  try {
    await pool.query(query);
    console.log("password_reset_otps table and index created/verified successfully.");
  } catch (error) {
    console.error("Error creating password_reset_otps table:", error);
    throw error;
  }
};

module.exports = { createOtpTable };

if (require.main === module) {
  createOtpTable()
    .then(() => pool.end())
    .catch((err) => {
      console.error(err);
      pool.end();
      process.exit(1);
    });
}
