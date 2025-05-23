import type { Express, Request, Response, NextFunction } from "express"; // Ensure Request, Response, NextFunction are imported
import { createServer, type Server } from "http";
import { storage } from "./storage";
import passport from 'passport'; // Added passport import

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // API endpoint to get learning paths - not used in this implementation
  // since we're storing everything on the client side
  app.get('/api/paths', (req, res) => {
    res.json({ message: 'Learning paths are stored client-side in this application.' });
  });

  // --- Authentication Routes ---

  // GET /auth/google - Initiates Google OAuth flow
  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  // GET /auth/google/callback - Google OAuth callback
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      // successRedirect: '/', // Using custom handler below for flexibility
      failureRedirect: process.env.FRONTEND_LOGIN_FAILURE_URL || '/login?error=true', // Redirect to frontend login page with error
    }),
    (req, res) => {
      // New logs here:
      console.log('[/auth/google/callback] Successfully authenticated by Passport.');
      console.log('[/auth/google/callback] req.user:', req.user);
      console.log('[/auth/google/callback] req.session:', req.session); 
      console.log('[/auth/google/callback] req.sessionID:', req.sessionID); // Also useful

      // Successful authentication, redirect to frontend.
      // The session is established by Passport at this point.
      res.redirect(process.env.FRONTEND_URL || '/'); // Redirect to frontend root or a specific success page
    }
  );

  // POST /api/auth/logout - Logs out the user
  app.post('/api/auth/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logout(err => { // req.logout requires a callback
      if (err) {
        return next(err); // Pass error to Express error handler
      }
      // req.session.destroy() is often called here to ensure the session is fully cleared.
      // Passport's req.logout() might not always clean up the session from the store immediately.
      req.session.destroy(destroyErr => {
        if (destroyErr) {
          // Log the error, but still try to send a success response for logout
          console.error("Session destruction error:", destroyErr);
          // Depending on application needs, you might want to return an error here
          // or ensure the client knows logout might not be fully complete on the server.
        }
        // Optional: Clear the session cookie from the browser.
        // The name 'connect.sid' is a common default for express-session.
        res.clearCookie('connect.sid'); 
        res.status(200).json({ message: 'Logged out successfully' });
      });
    });
  });

  // GET /api/auth/me - Fetches the current authenticated user's data
  app.get('/api/auth/me', (req, res) => {
    if (req.isAuthenticated()) { // Provided by Passport
      // req.user contains the authenticated user object from deserializeUser
      res.json(req.user); 
    } else {
      res.status(401).json({ message: 'User not authenticated' });
    }
  });

  // --- End Authentication Routes ---

  const httpServer = createServer(app);

  return httpServer;
}
