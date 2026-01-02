import express from "express";
import cors from "cors";

const app = express();

/**
 * Configuração de CORS
 * - Permite frontend local
 * - Permite frontend no Vercel
 */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://opp-frontend.vercel.app",
    ],
    methods: ["GET"],
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  return res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
