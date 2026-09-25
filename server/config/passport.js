const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("./db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        if (!email) {
          return done(new Error("No email address provided by Google OAuth"), null);
        }

        const username = profile.displayName || email.split("@")[0];
        const photoUrl = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;

        // Atomic Upsert: Insert new user OR update existing user matching the email
        const userResult = await pool.query(
          `INSERT INTO users (google_id, email, username, avatar_url, auth_provider)
           VALUES ($1, $2, $3, $4, 'google')
           ON CONFLICT (email) 
           DO UPDATE SET 
             google_id = EXCLUDED.google_id,
             username = COALESCE(users.username, EXCLUDED.username),
             avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
             auth_provider = 'google'
           RETURNING *;`,
          [googleId, email, username, photoUrl]
        );

        const user = userResult.rows[0];
        return done(null, user);
      } catch (error) {
        console.error("Error in Passport Google Strategy:", error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;