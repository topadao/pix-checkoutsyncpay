import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYNC_API_KEY = "57233d0a0e31a5587e159fdc";

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/gerar-pix", async (req, res) => {
  try {
    const body = {
      calendario: { expiracao: 900 },
      devedor: {},
      valor: { original: "36.90" },
      chave: "ba48977c-71d3-4fc9-8a21-5ecc4a939501",
      solicitacaoPagador: "Pagamento Cred Amigo Layalte Vermelho"
    };

    const response = await fetch("https://api.syncpay.com.br/v1/cobranca/evpl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": SYNC_API_KEY
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.json({
      qrCode: data.imagemQrcode,
      copiaCola: data.qrcode
    });

  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar Pix" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Servidor rodando na porta", port));