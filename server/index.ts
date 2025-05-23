import express, { type Request, Response, NextFunction } from "express";
import session from 'express-session'; // Added
import passport from 'passport'; // Added
import './auth'; // Import Passport configuration (should be already there)
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// 1. Body parsers (already present)
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // false is common, true allows richer objects

// Custom logging middleware (already present)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });
  next();
});

// 2. Session middleware setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'a_very_secret_key_for_development_only', // Use env var in production
  resave: false,
  saveUninitialized: false, // Set to false for only logged-in users
  cookie: {
    secure: process.env.NODE_ENV === 'production', // True in production (HTTPS)
    httpOnly: true, // Helps prevent XSS
    // maxAge: 1000 * 60 * 60 * 24 // Optional: e.g., 1 day
  }
  // store: new SomeStore(...) // Optional: For persistent session store in production
}));

// 3. Passport middleware setup
app.use(passport.initialize());
app.use(passport.session()); // Important: must come after express-session

// 4. Define isAuthenticated middleware function
// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) { // Provided by Passport
    return next();
  }
  res.status(401).json({ message: 'User not authenticated. Please log in.' });
};

// 5. CORS (if any - not specified here, but would go here)

// 6. Register Routes (after auth middleware)
(async () => {
  const server = await registerRoutes(app); // registerRoutes should be called after passport initialization

  // Error handling middleware (already present)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Error caught by global error handler:", err); // Added for better debugging
    res.status(status).json({ message });
    // Removed `throw err;` as it can stop the server if not caught by a higher-level handler
  });

  // Vite/static serving (already present)
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  server.listen(5000, '127.0.0.1', () => {
    console.log('Server running on http://127.0.0.1:5000');
  });
})();
