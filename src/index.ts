import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

/* =========================
   DOTENV (SOMENTE LOCAL)
========================= */
if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("dotenv").config();
}

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3333;

/* =========================
   SUPABASE CONFIG
========================= */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Variáveis do Supabase não configuradas");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* =========================
   HEALTH CHECK
========================= */
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

/* =========================
   AUTH LOGIN
========================= */
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha obrigatórios" });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  return res.json({
    accessToken: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  });
});

/* =========================
   FINANCE (PROTEGIDA)
========================= */
app.get("/finance", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não informado" });
  }

  const token = authHeader.replace("Bearer ", "");

  const { data: userData, error: userError } =
    await supabase.auth.getUser(token);

  if (userError || !userData.user) {
    return res.status(401).json({ error: "Token inválido" });
  }

  const { data, error } = await supabase
    .from("finance")
    .select("*")
    .limit(1);

  if (error) {
    return res.status(500).json({ error: "Erro ao buscar dados financeiros" });
  }

  return res.json(data[0]);
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
