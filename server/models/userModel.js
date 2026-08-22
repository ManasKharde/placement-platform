const pool = require("../config/db");

const findUserByUsernameOrEmail = async (identifier) => {
    const result = await pool.query(
        `SELECT id, username, email, password_hash, auth_provider
        FROM users WHERE username = $1 OR email = $1`,
        [identifier]
    );
    return result.rows[0];
}

const createUser = async (username, email, hashedPassword, auth_provider) => {
    const result = await pool.query(
        `INSERT INTO users
        (username, email, password_hash, auth_provider) 
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, email, auth_provider, created_at`,
        [username, email, hashedPassword, auth_provider]
    );
    return result.rows[0];
}

module.exports = { findUserByUsernameOrEmail, createUser };