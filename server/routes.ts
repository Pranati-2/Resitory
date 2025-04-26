import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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

  const httpServer = createServer(app);

  return httpServer;
}
