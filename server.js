const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
import { scalarExpressApiReference } from '@scalar/express-api-reference';
import swaggerDocument from './swagger.json' assert { type: 'json' };

const app = express();
app.use(express.json());
app.use(cors());
// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/products', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar:', err));

// Modelo (exemplo: produtos)
const Produto = mongoose.model('produtos_informatica', {
  nome: String,
  preco: Number,
  categoria: String
});

// Rotas CRUD
app.post('/produtos_informatica', async (req, res) => {
  const produto = await Produto.create(req.body);
  res.status(201).json(produto);
});

app.get('/produtos_informatica', async (req, res) => {
  const produtos = await Produto.find();
  res.json(produtos);
});

app.put('/produtos_informatica/:id', async (req, res) => {
  const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(produto);
});

app.delete('/produtos_informatica/:id', async (req, res) => {
  await Produto.findByIdAndDelete(req.params.id);
  res.json({ message: 'Produto removido com sucesso!' });
});

//Scallar API Reference Middleware
app.use(
  '/api-docs',
  scalarExpressApiReference({
    openapi: swaggerDocument,
    darkMode: true,
    theme: 'BluePlanet',
    layout: 'modern',
    title: 'Documentação da API de produtos de informática',
  })
);

// Servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
