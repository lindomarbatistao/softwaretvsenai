"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const { createHash } = require("crypto");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const db = require("./database/mysqlcon");

const PORT = process.env.PORT || 3001;
const app = express();

/* ===================== CORS ===================== */
const allowedOrigins = [
  "http://10.109.68.121:3000",
  "http://sistematv:3000",
];
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS: " + origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);
app.options("*", cors());

/* ============ Parsers e arquivos estáticos do server =========== */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use('/conteudo', express.static(path.join(__dirname, '..', 'uploads', 'conteudo')));
app.use('/conteudo', express.static(path.join(__dirname, '..', 'site', 'public', 'conteudo')));


/* ============== Uploads: pasta oficial + rota estática ============== */
const uploadsDir = path.join(__dirname, "..", "uploads", "conteudo");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = (file.mimetype && file.mimetype.split("/")[1]) || "bin";
    cb(null, `${file.originalname}-${Date.now()}.${ext}`);
  },
});
const uploadF = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

// Servir arquivos enviados em /conteudo
app.use("/conteudo", express.static(uploadsDir, { maxAge: "7d", etag: true }));
console.log("STATIC /conteudo ->", uploadsDir);

/* ===================== Healthcheck ===================== */
app.get("/api", (_req, res) => {
  res.json({ ok: true, message: "Hello from webservice!" });
});

/* ===================== Usuário ===================== */
app.post("/api/login", (req, res) => {
  db.query(
    "SELECT id, nome, senha, perfil_id, resetSenha FROM usuarios WHERE usuario = ?",
    [req.body.email],
    (error, results) => {
      if (error) return res.status(400).json({ result: "Ocorreu um erro" });
      if (!results || results.length === 0) {
        return res.status(406).json({ result: "Email ou senha incorreta" });
      }
      const ok =
        createHash("sha256").update(req.body.senha).digest("hex") ===
        results[0].senha;
      if (!ok) {
        return res.status(406).json({ result: "Email ou senha incorreta" });
      }
      return res.status(200).json({
        result: "Acesso liberado",
        p: results[0].perfil_id,
        email: req.body.email,
        reset: results[0].resetSenha,
        id: results[0].id,
        nome: results[0].nome,
      });
    }
  );
});

app.put("/api/login/senha", (req, res) => {
  db.query(
    "UPDATE usuarios SET senha = ?, resetSenha = 0 WHERE usuario = ?",
    [createHash("sha256").update(req.body.senha).digest("hex"), req.body.email],
    (error, results) => {
      if (error) return res.status(400).json({ result: "Ocorreu um erro" });
      if (results.affectedRows)
        return res.status(200).json({ result: "Senha atualizada" });
      return res
        .status(406)
        .json({ result: "Não foi possível atualizar a senha" });
    }
  );
});

app.post("/api/login/cadastrar", (req, res) => {
  db.query(
    "INSERT INTO usuarios (nome, usuario, senha, resetSenha, perfil_id) VALUES (?, ?, ?, ?, ?)",
    [
      req.body.nome,
      req.body.usuario,
      createHash("sha256").update(req.body.senha).digest("hex"),
      "0",
      "1",
    ],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(400).json({ result: "Ocorreu um erro" });
      }
      if (results.affectedRows)
        return res.status(200).json({ result: "Usuário cadastrado" });
      return res
        .status(200)
        .json({ result: "Não foi possível cadastrar" });
    }
  );
});

/* ===================== Conteúdo ===================== */
app.post("/api/conteudo/cadastrar", uploadF.single("imagem"), (req, res) => {
  if (!req.file) return res.status(400).json({ result: "Conteúdo sem arquivo" });

  const arquivo = req.file;
  db.query(
    "INSERT INTO conteudo (titulo, imagem, tempo, ativo, dataInicio, dataFim, mensagem, tvs_id) VALUES (?, ?, ?, 1, ?, ?, ?, ?)",
    [
      req.body.titulo,
      arquivo.filename,
      req.body.tempo,
      req.body.dataInicio,
      req.body.dataFim,
      req.body.mensagem,
      req.body.tvs_id,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(400).json({ result: "Ocorreu um erro" });
      }
      if (results.affectedRows)
        return res.status(200).json({ result: "Conteúdo cadastrado" });
      return res
        .status(200)
        .json({ result: "Não foi possível cadastrar" });
    }
  );
});

app.get("/api/conteudo/listar/:id", (req, res) => {
  db.query(
    "SELECT imagem, tempo, mensagem, id FROM tv_senai.conteudo WHERE ativo = 1 AND dataFim >= curdate() AND dataInicio <= curdate() AND Tvs_id = ?",
    [req.params.id],
    (error, results) => {
      if (error) return res.status(400).json({ result: "Ocorreu um erro" });
      if (results && results.length) return res.json(results);
      return res.status(200).json([]); // lista vazia
    }
  );
});

app.get("/api/conteudo/buscar/:id", (req, res) => {
  db.query(
    "SELECT * FROM tv_senai.conteudo WHERE ativo = 1 AND id = ?",
    [req.params.id],
    (error, results) => {
      if (error) return res.status(400).json({ result: "Ocorreu um erro" });
      if (results && results.length) return res.json(results);
      return res.status(200).json([]); // vazio
    }
  );
});

app.delete("/api/conteudo/apagar/:id", (req, res) => {
  db.query(
    "UPDATE conteudo SET ativo = 0 WHERE id = ?",
    [req.params.id],
    (error, results) => {
      if (error) return res.status(400).json({ result: "Ocorreu um erro" });
      if (results.affectedRows)
        return res.status(200).json({ result: "Conteúdo removido" });
      return res
        .status(406)
        .json({ result: "Não foi possível remover a TV" });
    }
  );
});

app.put("/api/conteudo/atualizar/:id", uploadF.single("imagem"), (req, res) => {
  if (!req.file) return res.status(400).json({ result: "Conteúdo sem arquivo" });

  const arquivo = req.file;
  db.query(
    "UPDATE conteudo SET titulo = ?, imagem = ?, tempo = ?, dataInicio = ?, dataFim = ?, mensagem = ?, tvs_id = ? WHERE id = ?",
    [
      req.body.titulo,
      arquivo.filename,
      req.body.tempo,
      req.body.dataInicio,
      req.body.dataFim,
      req.body.mensagem,
      req.body.tvs_id,
      req.params.id,
    ],
    (error, results) => {
      if (error) return res.status(400).json({ result: "Ocorreu um erro" });
      if (results.affectedRows)
        return res.status(200).json({ result: "Conteúdo atualizado" });
      return res
        .status(406)
        .json({ result: "Não foi possível atualizar o conteúdo" });
    }
  );
});

/* ===================== TV ===================== */
app.get("/api/tv/listar", (_req, res) => {
  db.query(
    "SELECT tvs.id, descricao, locais.nome FROM tvs, locais WHERE locais.id = locais_id AND tvs.ativo = 1",
    (error, results) => {
      if (error) return res.status(400).json({ result: "Ocorreu um erro" });
      if (results && results.length) return res.json(results);
      return res.status(200).json([]); // lista vazia
    }
  );
});

app.get("/api/tv/resumo", (_req, res) => {
  db.query(
    "SELECT distinct (SELECT count(id) FROM tv_senai.conteudo WHERE ativo = 1 AND dataFim >= curdate() AND dataInicio <= curdate() AND Tvs_id = tvs.id) AS Total, COALESCE((SELECT sum(tempo) FROM tv_senai.conteudo WHERE ativo = 1 AND dataFim >= curdate() AND dataInicio <= curdate() AND Tvs_id = tvs.id), 0) AS tempo, tvs.descricao AS TV, tvs.id FROM tvs, locais, conteudo WHERE locais.id = locais_id AND tvs.id = conteudo.Tvs_id AND tvs.ativo = 1 GROUP BY tvs.descricao, Total, tempo, tvs.id;",
    (error, results) => {
      if (error) return res.status(400).json({ result: "Ocorreu um erro" });
      if (results && results.length) return res.json(results);
      return res.status(200).json([]); // lista vazia
    }
  );
});

app.get("/api/tv/buscar/:id", (req, res) => {
  db.query("SELECT * FROM tvs WHERE id = ?", [req.params.id], (error, results) => {
    if (error) return res.status(400).json({ result: "Ocorreu um erro" });
    if (results && results.length) return res.json(results);
    return res.status(406).json({ result: "Não foi possível buscar a TV" });
  });
});

app.post("/api/tv/cadastrar", (req, res) => {
  db.query(
    "INSERT INTO tvs (ativo, descricao, locais_id) VALUES (1, ?, ?)",
    [req.body.descricao, req.body.locais_id],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(400).json({ result: "Ocorreu um erro" });
      }
      if (results.affectedRows)
        return res.status(200).json({ result: "TV cadastrada" });
      return res
        .status(200)
        .json({ result: "Não foi possível cadastrar" });
    }
  );
});

app.delete("/api/tv/apagar/:id", (req, res) => {
  db.query("UPDATE tvs SET ativo = 0 WHERE id = ?", [req.params.id], (error, results) => {
    if (error) return res.status(400).json({ result: "Ocorreu um erro" });
    if (results.affectedRows) return res.status(200).json({ result: "TV removida" });
    return res.status(406).json({ result: "Não foi possível remover a TV" });
  });
});

app.put("/api/tv/atualizar/:id", (req, res) => {
  db.query(
    "UPDATE tvs SET descricao = ?, locais_id = ? WHERE id = ?",
    [req.body.descricao, req.body.locais_id, req.params.id],
    (error, results) => {
      if (error) return res.status(400).json({ result: "Ocorreu um erro" });
      if (results.affectedRows) return res.status(200).json({ result: "TV atualizada" });
      return res.status(406).json({ result: "Não foi possível atualizar a TV" });
    }
  );
});

/* ===================== Local ===================== */
app.get("/api/local/listar", (_req, res) => {
  db.query("SELECT id, nome FROM locais ORDER BY nome", (error, results) => {
    if (error) return res.status(400).json({ result: "error" });
    if (results && results.length) return res.json(results);
    return res.status(200).json([]); // lista vazia
  });
});

app.post("/api/local/cadastrar", (req, res) => {
  db.query("INSERT INTO locais (nome) VALUES (?)", [req.body.nome], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(400).json({ result: "Ocorreu um erro" });
    }
    if (results.affectedRows) return res.status(200).json({ result: "Local cadastrado" });
    return res.status(200).json({ result: "Não foi possível cadastrar" });
  });
});

app.delete("/api/local/apagar/:id", (req, res) => {
  // OBS: se sua tabela correta é "locais", ajuste aqui.
  db.query("UPDATE local SET ativo = 0 WHERE id = ?", [req.params.id], (error, results) => {
    if (error) return res.status(400).json({ result: "Ocorreu um erro" });
    if (results.affectedRows) return res.status(200).json({ result: "TV removida" });
    return res.status(406).json({ result: "Não foi possível remover a TV" });
  });
});

/* ===================== Start ===================== */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on ${PORT}`);
});
