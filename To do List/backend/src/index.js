const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'saap',
  password: 'vale',
  port: 5432,
});

// const pool = new Pool({
//     user: 'local', // Substitua pelo seu usuário do PostgreSQL
//     host: 'localhost',
//     database: 'alugaCarros', // Nome da sua database
//     password: '12345', // Substitua pela sua senha
//     port: 5432, // Porta padrão do PostgreSQL
// });

app.use(cors());
app.use(express.json());

app.get('/tarefas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tarefas');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});

app.get('/tarefas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tarefas WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar tarefa' });
  }
});

app.post('/tarefas', async (req, res) => {

  const { descricao, nomesetor, prioridade, datacadastro, status, fk_id_usuario} = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tarefas (descricao, nomesetor, prioridade, datacadastro, status, fk_id_usuario) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [ descricao, nomesetor, prioridade, datacadastro, status, fk_id_usuario]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao adicionar tarefa' });
  }
});

app.put('/tarefas/:id', async (req, res) => {
  const { id } = req.params;
  const { descricao, nomesetor, prioridade, datacadastro, status, fk_id_usuario} = req.body;
  try {
    const result = await pool.query(
      'UPDATE tarefas SET descricao = $1, nomesetor = $2, prioridade = $3, datacadastro = $4, status = $5, fk_id_usuario = $6 WHERE id = $7 RETURNING *',
      [descricao, nomesetor, prioridade, datacadastro, status, fk_id_usuario, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

app.delete('/tarefas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tarefas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefas não encontrada' });
    }
    res.json({ message: 'Tarefa deletada com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
});

app.post('/usuario', async (req, res) => {
  const { nome, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuario (nome, email) VALUES ($1, $2) RETURNING *',
      [nome, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao adicionar usuario' });
  }
});

app.get('/usuario', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuario');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar usuario' });
  }
});
app.get('/usuario/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuario WHERE id = $1 RETURNING *', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar usuario' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});