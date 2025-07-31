const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Importa as rotas
const promptRoutes = require('./routes/promptBuilder');

// Cria a aplicação Express
const app = express();

// Configuração da porta
const PORT = process.env.PORT || 3000;

// Middleware de segurança
app.use(helmet());

// Middleware para CORS (permite requisições de diferentes origens)
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://seu-dominio.com'] // Configure seu domínio em produção
    : true, // Permite todas as origens em desenvolvimento
  credentials: true
}));

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Middleware de logging para requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rota raiz com informações da API
app.get('/', (req, res) => {
  res.json({
    message: 'Agente de IA para Criação de Prompts - API',
    version: '1.0.0',
    description: 'API para ajudar usuários a criarem prompts melhores para o ChatGPT',
    endpoints: {
      '/prompt': 'Documentação da API de prompts',
      '/prompt/start': 'POST - Inicia criação de prompt',
      '/prompt/complete': 'POST - Completa criação de prompt',
      '/prompt/health': 'GET - Status do serviço'
    },
    documentation: 'Consulte /prompt para ver a documentação completa'
  });
});

// Rota de health check geral
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Registra as rotas de prompt
app.use('/prompt', promptRoutes);

// Middleware de tratamento de erros 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Middleware de tratamento de erros globais
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor'
      : error.message,
    timestamp: new Date().toISOString()
  });
});

// Função para iniciar o servidor
function startServer() {
  try {
    // Verifica se a chave da OpenAI está configurada
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ ERRO: OPENAI_API_KEY não está configurada no arquivo .env');
      console.log('📝 Por favor, configure sua chave da OpenAI no arquivo .env');
      process.exit(1);
    }

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log('🚀 Servidor iniciado com sucesso!');
      console.log(`📍 Servidor rodando em: http://localhost:${PORT}`);
      console.log(`📚 Documentação da API: http://localhost:${PORT}/prompt`);
      console.log(`💚 Health Check: http://localhost:${PORT}/health`);
      console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🤖 Modelo OpenAI: ${process.env.OPENAI_MODEL || 'gpt-4'}`);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

// Tratamento de sinais para encerramento graceful
process.on('SIGINT', () => {
  console.log('\n🛑 Recebido sinal SIGINT, encerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Recebido sinal SIGTERM, encerrando servidor...');
  process.exit(0);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada não tratada:', reason);
  process.exit(1);
});

// Inicia o servidor
startServer(); 