const express = require('express');
const promptService = require('../services/promptService');

const router = express.Router();

/**
 * Rota para obter serviços disponíveis
 * GET /prompt/services
 */
router.get('/services', async (req, res) => {
  try {
    const result = await promptService.getAvailableServices();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro na rota /prompt/services:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    });
  }
});

/**
 * Rota para obter informações de um serviço específico
 * GET /prompt/services/:service
 */
router.get('/services/:service', async (req, res) => {
  try {
    const { service } = req.params;
    const result = await promptService.getServiceInfo(service);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Erro na rota /prompt/services/${req.params.service}:`, error);
    
    return res.status(404).json({
      success: false,
      error: error.message || 'Serviço não encontrado'
    });
  }
});

/**
 * Rota para iniciar o processo de criação de prompt
 * POST /prompt/start
 * 
 * Recebe a intenção do usuário e o serviço escolhido, retorna 3 perguntas para entender melhor o que ele quer
 */
router.post('/start', async (req, res) => {
  try {
    const { intention, service = 'chatgpt' } = req.body;

    // Valida se a intenção foi fornecida no corpo da requisição
    if (!intention) {
      return res.status(400).json({
        success: false,
        error: 'Campo "intention" é obrigatório no corpo da requisição'
      });
    }

    // Chama o serviço para gerar as perguntas
    const result = await promptService.startPromptCreation(intention, service);

    return res.status(200).json(result);

  } catch (error) {
    console.error('Erro na rota /prompt/start:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    });
  }
});

/**
 * Rota para completar o processo de criação de prompt
 * POST /prompt/complete
 * 
 * Recebe a intenção, as respostas do usuário e o serviço escolhido, retorna um prompt final bem formatado
 */
router.post('/complete', async (req, res) => {
  try {
    const { intention, answers, service = 'chatgpt' } = req.body;

    // Valida se os campos obrigatórios foram fornecidos
    if (!intention) {
      return res.status(400).json({
        success: false,
        error: 'Campo "intention" é obrigatório no corpo da requisição'
      });
    }

    if (!answers) {
      return res.status(400).json({
        success: false,
        error: 'Campo "answers" é obrigatório no corpo da requisição'
      });
    }

    // Chama o serviço para gerar o prompt final
    const result = await promptService.completePromptCreation(intention, answers, service);

    return res.status(200).json(result);

  } catch (error) {
    console.error('Erro na rota /prompt/complete:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    });
  }
});

/**
 * Rota de health check para verificar se o serviço está funcionando
 * GET /prompt/health
 */
router.get('/health', async (req, res) => {
  try {
    const healthStatus = await promptService.healthCheck();
    
    if (healthStatus.success) {
      return res.status(200).json(healthStatus);
    } else {
      return res.status(503).json(healthStatus);
    }
  } catch (error) {
    console.error('Erro no health check:', error);
    
    return res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Rota de documentação da API
 * GET /prompt
 */
router.get('/', (req, res) => {
  res.json({
    message: 'API do Agente de IA para Criação de Prompts',
    version: '2.0.0',
    description: 'Suporte a múltiplos serviços de IA: ChatGPT, Claude, Gemini, Llama',
    endpoints: {
      'GET /prompt/services': {
        description: 'Lista todos os serviços de IA disponíveis',
        response: {
          success: 'boolean',
          services: 'object - Lista de serviços com informações'
        }
      },
      'GET /prompt/services/:service': {
        description: 'Obtém informações de um serviço específico',
        response: {
          success: 'boolean',
          service: 'string',
          serviceInfo: 'object - Informações detalhadas do serviço'
        }
      },
      'POST /prompt/start': {
        description: 'Inicia o processo de criação de prompt',
        body: {
          intention: 'string (obrigatório) - A intenção do usuário',
          service: 'string (opcional) - O serviço de IA (padrão: chatgpt)'
        },
        response: {
          success: 'boolean',
          intention: 'string',
          service: 'string',
          serviceInfo: 'object',
          questions: 'string - 3 perguntas geradas',
          message: 'string'
        }
      },
      'POST /prompt/complete': {
        description: 'Completa o processo de criação de prompt',
        body: {
          intention: 'string (obrigatório) - A intenção original',
          answers: 'array (obrigatório) - As respostas do usuário',
          service: 'string (opcional) - O serviço de IA (padrão: chatgpt)'
        },
        response: {
          success: 'boolean',
          intention: 'string',
          service: 'string',
          serviceInfo: 'object',
          answers: 'array',
          finalPrompt: 'string - Prompt final formatado',
          message: 'string'
        }
      },
      'GET /prompt/health': {
        description: 'Verifica o status do serviço',
        response: {
          success: 'boolean',
          status: 'string',
          ai: 'string',
          timestamp: 'string'
        }
      }
    },
    supportedServices: {
      chatgpt: 'ChatGPT - Modelo avançado da OpenAI',
      claude: 'Claude - Modelo da Anthropic',
      gemini: 'Gemini - Modelo do Google',
      llama: 'Llama - Modelo open source'
    }
  });
});

module.exports = router; 