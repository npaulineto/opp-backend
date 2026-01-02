import express from "express";
import cors from "cors";

const app = express();

/**
 * CORS dinâmico
 * - Permite localhost
 * - Permite QUALQUER domínio do Vercel
 */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        // permite chamadas como curl / server-to-server
        return callback(null, true);
      }

      if (
        origin.startsWith("http://localhost") ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
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
