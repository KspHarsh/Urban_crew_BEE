import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

// ============================================
// Google OAuth 2.0 Strategy — Passport.js
// ============================================
// This strategy ONLY verifies the Google profile.
// User creation/lookup is handled in the route callback
// based on mode (login vs register).
// ============================================

const configurePassport = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/auth/google/callback',
                scope: ['profile', 'email'],
                passReqToCallback: true // Pass req so we can read query state
            },
            async (req, accessToken, refreshToken, profile, done) => {
                try {
                    // Extract email from Google profile
                    const email = profile.emails && profile.emails[0]
                        ? profile.emails[0].value.toLowerCase()
                        : null;

                    if (!email) {
                        return done(new Error('No email found in Google profile'), null);
                    }

                    // Attach raw profile info to req for route handler to process
                    // Don't create/lookup user here — let the callback route decide
                    const googleProfile = {
                        googleId: profile.id,
                        name: profile.displayName,
                        email
                    };

                    return done(null, googleProfile);
                } catch (error) {
                    console.error('Google OAuth error:', error);
                    return done(error, null);
                }
            }
        )
    );

    // Serialize / Deserialize (minimal — we use JWT, not sessions)
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
};

export default configurePassport;
