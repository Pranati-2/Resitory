import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { storage } from './storage'; // Your user storage instance
import { User } from '@shared/schema'; // Assuming User type is needed
import 'dotenv/config';
// or if using CommonJS:
// require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback', // Default if not in env
  scope: ['profile', 'email'] // Request access to profile and email
},

async (accessToken: any, refreshToken: any, profile: { emails: string | any[]; id: any; displayName: any; photos: string | any[]; }, done: (arg0: unknown, arg1: { email: string; id: number; googleId: string | null; displayName: string; avatarUrl: string | null; createdAt: Date; } | undefined) => any) => {
=======
async (accessToken, refreshToken, profile, done) => {
  console.log('[GoogleStrategy VerifyCb] Reached verify callback.'); // New log
  console.log('[GoogleStrategy VerifyCb] AccessToken (sample - first 10 chars):', accessToken?.substring(0, 10)); // New log - sample, don't log full token
  // console.log('[GoogleStrategy VerifyCb] RefreshToken:', refreshToken); // Usually undefined unless offline access requested & configured
  console.log('[GoogleStrategy VerifyCb] Profile from Google:', JSON.stringify(profile, null, 2)); // New log - Full profile
  try {
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : undefined;
    console.log('[GoogleStrategy VerifyCb] Extracted email:', email); // New log

    if (!email) {
      console.error('[GoogleStrategy VerifyCb] No email found in Google profile.'); // New log
      return done(new Error("No email found in Google profile"), undefined);
    }

    console.log('[GoogleStrategy VerifyCb] Calling storage.findOrCreateUserByGoogleId with profile ID:', profile.id); // New log
    const user = await storage.findOrCreateUserByGoogleId({
      googleId: profile.id,
      email: email,
      displayName: profile.displayName,
      avatarUrl: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined
    });
    console.log('[GoogleStrategy VerifyCb] User from storage.findOrCreateUserByGoogleId:', user); // New log

    return done(null, user);
  } catch (err) {
    console.error('[GoogleStrategy VerifyCb] Error in verify callback:', err); // Modified log
    return done(err, undefined);
  }
}));

passport.serializeUser((user, done) => {
  console.log('[Passport serializeUser] Serializing user:', user); // New log
  // The user object here is what you passed to `done` in the strategy
  // We need its internal ID from our database/storage
  const userId = (user as User).id; // Assuming 'User' type has 'id'
  console.log('[Passport serializeUser] Storing user ID in session:', userId); // New log
  done(null, userId); 
});

passport.deserializeUser(async (id: number, done) => { // Ensure 'id' is typed if possible, e.g., id: number
  console.log('[Passport deserializeUser] Attempting to deserialize user with ID:', id); // New log
  try {
    const user = await storage.getUser(id as number); // Cast id if necessary
    console.log('[Passport deserializeUser] User fetched from storage:', user); // New log
    done(null, user || false); // If user not found, pass false or null
  } catch (err) {
    console.error('[Passport deserializeUser] Error during deserialization:', err); // Modified log
    done(err, undefined);
  }
});

// No need to export passport explicitly if this file is imported for its side effects (configuration)
// import './auth'; in index.ts will execute the above configurations.
