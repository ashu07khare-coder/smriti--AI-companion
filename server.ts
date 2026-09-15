import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { apiRouter } from "./server/routes";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON and URL-encoded body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging for API endpoints
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // Mount API router
  app.use('/api/v1', apiRouter);
  app.use('/api', apiRouter); // Alias for convenience

  // Vite middleware for development vs static files for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smriti Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
