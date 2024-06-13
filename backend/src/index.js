const restify = require('restify');
const { Pool } = require('pg');
const moment = require('moment');

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'db',
  database: process.env.POSTGRES_DB || 'contas',
  password: process.env.POSTGRES_PASSWORD || 'password',
  port: process.env.POSTGRES_PORT || 5432,
});

// iniciar o servidor
var server = restify.createServer({
  name: 'controle-financeiro',
});

// Iniciando o banco de dados
async function initDatabase() {
  try {
    await pool.query('DROP TABLE IF EXISTS contas');
    await pool.query(`CREATE TABLE IF NOT EXISTS contas (
      id SERIAL PRIMARY KEY, 
      nome VARCHAR(255) NOT NULL, 
      valor VARCHAR(255) NOT NULL, 
      vencimento VARCHAR(255) NOT NULL,
      status VARCHAR(50) NOT NULL CHECK (status IN ('vencida', 'paga', 'a vencer'))
    )`);
    console.log('Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao iniciar o banco de dados, tentando novamente em 5 segundos:', error);
    setTimeout(initDatabase, 5000);
  }
}

// Middleware para permitir o parsing do corpo da requisição
server.use(restify.plugins.bodyParser());


// Endpoint para inserir uma nova conta
server.post('/api/v1/conta/inserir', async (req, res, next) => {
  const { nome, valor, vencimento, status } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO contas (nome, valor, vencimento, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, valor, vencimento, status]
    );
    res.send(201, result.rows[0]);
    console.log('Conta inserida com sucesso:', result.rows[0]);
  } catch (error) {
    console.error('Erro ao inserir conta:', error);
    res.send(500, { message: 'Erro ao inserir conta' });
  }
  return next();
});

// Endpoint para listar todas as contas
server.get('/api/v1/conta/listar', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM contas');
    res.send(result.rows);
    console.log('Contas encontradas:', result.rows);
  } catch (error) {
    console.error('Erro ao listar contas:', error);
    res.send(500, { message: 'Erro ao listar contas' });
  }
  return next();
});

// Endpoint para atualizar uma conta existente
server.post('/api/v1/conta/atualizar', async (req, res, next) => {
  const { id, nome, valor, vencimento, status } = req.body;

  try {
    const result = await pool.query(
      'UPDATE contas SET nome = $1, valor = $2, vencimento = $3, status = $4 WHERE id = $5 RETURNING *',
      [nome, valor, vencimento, status, id]
    );
    if (result.rows.length === 0) {
      res.send(404, { message: 'Conta não encontrada' });
    } else {
      res.send(result.rows[0]);
      console.log('Conta atualizada com sucesso:', result.rows[0]);
    }
  } catch (error) {
    console.error('Erro ao atualizar conta:', error);
    res.send(500, { message: 'Erro ao atualizar conta' });
  }
  return next();
});

// Endpoint para excluir uma conta
server.post('/api/v1/conta/excluir', async (req, res, next) => {
  const { id } = req.body;

  try {
    const result = await pool.query('DELETE FROM contas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.send(404, { message: 'Conta não encontrada' });
    } else {
      res.send({ message: 'Conta excluída com sucesso' });
      console.log('Conta excluída com sucesso:', result.rows[0]);
    }
  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    res.send(500, { message: 'Erro ao excluir conta' });
  }
  return next();
});

// Endpoint para resetar o banco de dados
server.del('/api/v1/database/reset', async (req, res, next) => {
  try {
    await pool.query('DROP TABLE IF EXISTS contas');
    await pool.query(`CREATE TABLE IF NOT EXISTS contas (
      id SERIAL PRIMARY KEY, 
      nome VARCHAR(255) NOT NULL, 
      valor VARCHAR(255) NOT NULL, 
      vencimento VARCHAR(255) NOT NULL,
      status VARCHAR(50) NOT NULL CHECK (status IN ('vencida', 'paga', 'a vencer'))
    )`);
    res.send({ message: 'Banco de dados resetado com sucesso' });
    console.log('Banco de dados resetado com sucesso');
  } catch (error) {
    console.error('Erro ao resetar o banco de dados:', error);
    res.send(500, { message: 'Erro ao resetar o banco de dados' });
  }
  return next();
});

// Iniciar o banco de dados e o servidor
initDatabase().then(() => {
  server.listen(5000, function () {
    console.log('%s listening at %s', server.name, server.url);
  });
});
