const pool = require("../config/db");

const findUserByUsernameOrEmail = async (identifier) => {
    if (!identifier) return null;
    const cleanId = String(identifier).trim();
    const result = await pool.query(
        `SELECT id, username, email, password_hash, auth_provider
        FROM users 
        WHERE LOWER(email) = LOWER($1) OR username = $1`,
        [cleanId]
    );
    return result.rows[0];
};

const createUser = async (username, email, hashedPassword, auth_provider) => {
    const cleanUsername = String(username).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const result = await pool.query(
        `INSERT INTO users
        (username, email, password_hash, auth_provider) 
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, email, auth_provider, created_at`,
        [cleanUsername, cleanEmail, hashedPassword, auth_provider]
    );
    return result.rows[0];
};

const findUserByEmail = async (email) => {
    if (!email) return null;
    const cleanEmail = String(email).trim().toLowerCase();
    const result = await pool.query(
        `SELECT id, username, email, password_hash, auth_provider
        FROM users 
        WHERE LOWER(email) = LOWER($1)`,
        [cleanEmail]
    );
    return result.rows[0];
};

const updateUserPassword = async (userId, hashedPassword) => {
    await pool.query(
        `UPDATE users 
         SET password_hash = $1, refresh_token = NULL, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [hashedPassword, userId]
    );
};

module.exports = { findUserByUsernameOrEmail, findUserByEmail, createUser, updateUserPassword };