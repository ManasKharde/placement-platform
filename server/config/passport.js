const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("./db");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const googleId = profile.id;
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
                const username = profile.displayName || email.split("@")[0];

                // Inside your Passport Google Strategy callback:
                const photoUrl = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;

                // Example Upsert / Insert logic:
                const userResult = await pool.query(
                `INSERT INTO users (google_id, email, username, avatar_url)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (google_id) 
                DO UPDATE SET avatar_url = EXCLUDED.avatar_url
                RETURNING *;`,
                [profile.id, profile.emails[0].value, profile.displayName, photoUrl]
                );

                if (userResult.rows.length > 0) {
                    return done(null, userResult.rows[0]);
                }

                if (email) {
                    userResult = await pool.query(
                        `SELECT * FROM users WHERE email = $1`, [email]
                    )
                    if (userResult.rows.length > 0) {
                        const updatedUser = await pool.query(
                            `UPDATE users SET auth_provider = $1, provider_id = $2, updated_at = CURRENT_TIMESTAMP WHERE email = $3 RETURNING *`, ["google",googleId, email]
                        )
                        return done(null, updatedUser.rows[0])
                    }
                }

                const newUser = await pool.query(
                    `INSERT INTO users(username, email, auth_provider, provider_id) VALUES ($1, $2, $3, $4)`, [username, email, "google", googleId]
                )
                return done(null, newUser.rows[0]);
            }
            catch (error) {
                return done(error, null);
            }
        }
    )
)

module.exports = { passport };