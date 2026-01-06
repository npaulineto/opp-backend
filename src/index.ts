import "dotenv/config";

import express from "express";
import cors from "cors";
import path from "path";

const app = express();

/**
 * CORS GLOBAL
 */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://opp-frontend-neon.vercel.app",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());
app.use(express.json());

/**
 * 🔒 Rotas resolvidas a partir da RAIZ do projeto
 * (compatível com ts-node-dev no Render)
 */
const authRoutes = require(
  path.resolve(process.cwd(), "src", "routes", "auth.routes")
).default;

const financeRoutes = require(
  path.resolve(process.cwd(), "src", "routes", "finance.routes")
).default;

app.use("/auth", authRoutes);
app.use("/finance", financeRoutes);

/**
 * Health
 */
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
