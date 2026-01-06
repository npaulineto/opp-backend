import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import financeRoutes from "./routes/finance.routes";

const app = express();

/**
 * CORS GLOBAL — precisa vir ANTES das rotas
 */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://opp-backend-8nlo.onrender.com",
      // coloque aqui a URL do seu frontend no Vercel
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/**
 * Permite explicitamente requisições OPTIONS (preflight)
 */
app.options("*", cors());

app.use(express.json());

/**
 * Rotas
 */
app.use("/auth", authRoutes);
app.use("/finance", financeRoutes);

/**
 * Health check
 */
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
