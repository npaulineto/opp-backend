import "dotenv/config";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();

/**
 * CORS dinâmico
 */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

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

/**
 * Variáveis de ambiente
 */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Variáveis do Supabase não configuradas");
}

/**
 * Cliente Supabase (backend)
 */
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Rota de saúde
 */
app.get("/health", (req, res) => {
  return res.json({ status: "ok" });
});

/**
 * Rota financeira (dados reais do Supabase)
 */
app.get("/finance", async (req, res) => {
  const { data, error } = await supabase
    .from("financial_summary")
    .select("revenue, expenses, balance")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Erro ao buscar dados financeiros:", error);
    return res.status(500).json({ error: "Erro ao buscar dados financeiros" });
  }

  return res.json({
    revenue: data.revenue,
    expenses: data.expenses,
    balance: data.balance,
  });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
