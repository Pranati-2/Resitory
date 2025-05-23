import express, { type Request, Response, NextFunction } from "express";
import session from 'express-session';
import passport from 'passport';
import cors from 'cors'; // Step 2.1: Import cors
import './auth'; // Import Passport configuration
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// 1. Body parsers (already present)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 2. Custom logging middleware (already present)
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

// Step 2.2: Define CORS Options & Step 2.3: Use CORS Middleware
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const corsOptions = {
  origin: frontendUrl,
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); // Placed before session/Passport

// Session middleware setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'a_very_secret_key_for_development_only',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  }
}));

// Passport middleware setup
app.use(passport.initialize());
app.use(passport.session());

// Define isAuthenticated middleware function
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'User not authenticated. Please log in.' });
};

// Register Routes
(async () => {
  const server = await registerRoutes(app);

  // Debug: Log registered routes
  console.log("Attempting to print registered routes...");
  if (app._router && app._router.stack) {
    app._router.stack.forEach((middleware: any) => {
      if (middleware.route) {
        console.log(`ROUTE: ${middleware.route.stack[0].method.toUpperCase()} ${middleware.route.path}`);
      } else if (middleware.name === 'router') {
        middleware.handle.stack.forEach((handler: any) => {
          if (handler.route) {
            console.log(`ROUTER ROUTE: ${handler.route.stack[0].method.toUpperCase()} ${handler.route.path}`);
          }
        });
      }
    });
  } else {
    console.log("Could not inspect app._router.stack to print routes.");
  }

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Error caught by global error handler:", err);
    res.status(status).json({ message });
  });

  // Vite/static serving
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  server.listen(5000, '127.0.0.1', () => {
    console.log('Server running on http://127.0.0.1:5000');
  });
})();
