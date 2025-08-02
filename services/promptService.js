const aiClient = require('../utils/openaiClient');

/**
 * Serviço responsável por toda a lógica de negócio relacionada aos prompts
 * Gerencia a comunicação entre as rotas e o cliente de IA
 */
class PromptService {
  /**
   * Inicia o processo de criação de prompt gerando perguntas para o usuário
   * @param {string} intention - A intenção inicial do usuário
   * @param {string} service - O serviço de IA escolhido
   * @returns {Promise<Object>} - Objeto com as perguntas geradas
   */
  async startPromptCreation(intention, service = 'chatgpt') {
    try {
      // Valida se a intenção foi fornecida
      if (!intention || intention.trim().length === 0) {
        throw new Error('Intenção é obrigatória');
      }

      // Valida se o serviço é suportado
      if (!aiClient.isServiceSupported(service)) {
        throw new Error(`Serviço '${service}' não é suportado`);
      }

      // Gera perguntas usando o cliente de IA
      const questions = await aiClient.generateQuestions(intention.trim(), service);
      const serviceInfo = aiClient.getServiceInfo(service);

      return {
        success: true,
        intention: intention.trim(),
        service: service,
        serviceInfo: serviceInfo,
        questions: questions,
        message: 'Perguntas geradas com sucesso'
      };
    } catch (error) {
      console.error('Erro no serviço de prompt:', error);
      throw new Error(`Erro ao gerar perguntas: ${error.message}`);
    }
  }

  /**
   * Completa o processo de criação de prompt gerando o prompt final
   * @param {string} intention - A intenção original do usuário
   * @param {Array<string>} answers - As respostas do usuário às perguntas
   * @param {string} service - O serviço de IA escolhido
   * @returns {Promise<Object>} - Objeto com o prompt final
   */
  async completePromptCreation(intention, answers, service = 'chatgpt') {
    try {
      // Validações dos parâmetros de entrada
      if (!intention || intention.trim().length === 0) {
        throw new Error('Intenção é obrigatória');
      }

      if (!answers || !Array.isArray(answers) || answers.length === 0) {
        throw new Error('Respostas são obrigatórias e devem ser um array');
      }

      // Valida se o serviço é suportado
      if (!aiClient.isServiceSupported(service)) {
        throw new Error(`Serviço '${service}' não é suportado`);
      }

      // Valida se todas as respostas têm conteúdo
      const validAnswers = answers.filter(answer => answer && answer.trim().length > 0);
      if (validAnswers.length === 0) {
        throw new Error('Pelo menos uma resposta válida é obrigatória');
      }

      // Gera o prompt final usando o cliente de IA
      const finalPrompt = await aiClient.generateFinalPrompt(
        intention.trim(),
        validAnswers.map(answer => answer.trim()),
        service
      );

      const serviceInfo = aiClient.getServiceInfo(service);

      return {
        success: true,
        intention: intention.trim(),
        service: service,
        serviceInfo: serviceInfo,
        answers: validAnswers,
        finalPrompt: finalPrompt,
        message: 'Prompt final gerado com sucesso'
      };
    } catch (error) {
      console.error('Erro no serviço de prompt:', error);
      throw new Error(`Erro ao gerar prompt final: ${error.message}`);
    }
  }

  /**
   * Retorna a lista de serviços disponíveis
   * @returns {Promise<Object>} - Lista de serviços
   */
  async getAvailableServices() {
    try {
      const services = aiClient.getAvailableServices();
      
      return {
        success: true,
        services: services,
        message: 'Serviços disponíveis recuperados com sucesso'
      };
    } catch (error) {
      console.error('Erro ao obter serviços:', error);
      throw new Error(`Erro ao obter serviços: ${error.message}`);
    }
  }

  /**
   * Retorna informações sobre um serviço específico
   * @param {string} service - O serviço solicitado
   * @returns {Promise<Object>} - Informações do serviço
   */
  async getServiceInfo(service) {
    try {
      const serviceInfo = aiClient.getServiceInfo(service);
      
      if (!serviceInfo) {
        throw new Error(`Serviço '${service}' não encontrado`);
      }

      return {
        success: true,
        service: service,
        serviceInfo: serviceInfo,
        message: 'Informações do serviço recuperadas com sucesso'
      };
    } catch (error) {
      console.error('Erro ao obter informações do serviço:', error);
      throw new Error(`Erro ao obter informações do serviço: ${error.message}`);
    }
  }

  /**
   * Valida se o serviço está funcionando corretamente
   * @returns {Promise<Object>} - Status do serviço
   */
  async healthCheck() {
    try {
      // Testa uma comunicação simples com a IA
      const testResponse = await aiClient.sendMessage('Responda apenas com "OK"', 'chatgpt', 10);
      
      return {
        success: true,
        status: 'healthy',
        ai: testResponse.trim() === 'OK' ? 'connected' : 'error',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Exporta uma instância única do serviço
module.exports = new PromptService(); 