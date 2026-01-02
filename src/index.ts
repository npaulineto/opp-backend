import express from "express";

const app = express();

const PORT = 3333;

app.get("/health", (req, res) => {
  return res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
