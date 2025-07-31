const OpenAI = require('openai');
require('dotenv').config();

/**
 * Cliente de IA configurado para múltiplos serviços
 * Responsável por gerenciar todas as interações com diferentes APIs de IA
 */
class AIClient {
  constructor() {
    // Verifica se a chave da API está configurada
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY não está configurada no arquivo .env');
    }

    // Inicializa o cliente da OpenAI
    this.openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Configurações dos diferentes serviços (sempre usa GPT-4 para gerar perguntas e prompts)
    this.services = {
      chatgpt: {
        name: 'ChatGPT',
        model: process.env.OPENAI_MODEL || 'gpt-4',
        description: 'Modelo avançado da OpenAI, ideal para conversas e tarefas complexas',
        maxTokens: 4000,
        temperature: 0.7
      },
      claude: {
        name: 'Claude',
        model: process.env.OPENAI_MODEL || 'gpt-4',
        description: 'Modelo da Anthropic, excelente para análise e escrita criativa',
        maxTokens: 4000,
        temperature: 0.7
      },
      gemini: {
        name: 'Gemini',
        model: process.env.OPENAI_MODEL || 'gpt-4',
        description: 'Modelo do Google, ótimo para tarefas multidisciplinares',
        maxTokens: 4000,
        temperature: 0.7
      },
      llama: {
        name: 'Llama',
        model: process.env.OPENAI_MODEL || 'gpt-4',
        description: 'Modelo open source, bom para desenvolvimento e experimentação',
        maxTokens: 4000,
        temperature: 0.7
      }
    };
  }

  /**
   * Envia uma mensagem para o modelo da OpenAI e retorna a resposta
   * @param {string} message - A mensagem a ser enviada
   * @param {string} service - O serviço a ser usado (chatgpt, claude, gemini, llama)
   * @param {number} maxTokens - Número máximo de tokens na resposta
   * @returns {Promise<string>} - A resposta do modelo
   */
  async sendMessage(message, service = 'chatgpt', maxTokens = null) {
    try {
      const serviceConfig = this.services[service];
      if (!serviceConfig) {
        throw new Error(`Serviço '${service}' não suportado`);
      }

      // Sempre usa o modelo gpt-4 para gerar perguntas e prompts
      const modelToUse = process.env.OPENAI_MODEL || 'gpt-4';

      const response = await this.openaiClient.chat.completions.create({
        model: modelToUse,
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(service)
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: maxTokens || serviceConfig.maxTokens,
        temperature: serviceConfig.temperature
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error(`Erro ao comunicar com ${service}:`, error);
      throw new Error(`Erro ao processar a solicitação com ${service}`);
    }
  }

  /**
   * Retorna o prompt do sistema específico para cada serviço
   * @param {string} service - O serviço a ser usado
   * @returns {string} - O prompt do sistema
   */
  getSystemPrompt(service) {
    const basePrompt = 'Você é um assistente especializado em ajudar usuários a criarem prompts melhores para diferentes serviços de IA. Seja claro, específico e útil.';
    
    const serviceSpecificPrompts = {
      chatgpt: `${basePrompt} Foque em criar prompts que funcionem bem com o ChatGPT, considerando suas capacidades e limitações.`,
      claude: `${basePrompt} Crie prompts otimizados para o Claude, que é conhecido por sua capacidade analítica e escrita criativa.`,
      gemini: `${basePrompt} Desenvolva prompts que aproveitem as capacidades multidisciplinares do Gemini.`,
      llama: `${basePrompt} Gere prompts compatíveis com o Llama, considerando que é um modelo open source.`
    };

    return serviceSpecificPrompts[service] || basePrompt;
  }

  /**
   * Gera perguntas para entender melhor a intenção do usuário
   * @param {string} intention - A intenção inicial do usuário
   * @param {string} service - O serviço de IA escolhido
   * @returns {Promise<string>} - 3 perguntas formatadas
   */
  async generateQuestions(intention, service = 'chatgpt') {
    const prompt = `
    Com base na seguinte intenção do usuário: "${intention}"
    
    E considerando que o usuário quer usar o ${this.services[service].name} (${this.services[service].description}),
    
    Gere exatamente 3 perguntas específicas e relevantes que ajudarão a entender melhor o que o usuário quer. 
    As perguntas devem ser diretas e focadas em detalhes importantes.
    
    Formate a resposta como uma lista numerada simples, sem explicações adicionais.
    `;

    return await this.sendMessage(prompt, service, 500);
  }

  /**
   * Cria um prompt final bem formatado baseado na intenção e respostas
   * @param {string} intention - A intenção original do usuário
   * @param {Array<string>} answers - As respostas do usuário às perguntas
   * @param {string} service - O serviço de IA escolhido
   * @returns {Promise<string>} - Prompt final formatado
   */
  async generateFinalPrompt(intention, answers, service = 'chatgpt') {
    const serviceInfo = this.services[service];
    
    const prompt = `
    Intenção original: "${intention}"
    
    Respostas do usuário:
    ${answers.map((answer, index) => `${index + 1}. ${answer}`).join('\n')}
    
    Serviço de IA: ${serviceInfo.name}
    Descrição: ${serviceInfo.description}
    
    Com base na intenção, nas respostas fornecidas e nas características do ${serviceInfo.name}, 
    crie um prompt final bem estruturado e detalhado que o usuário pode usar diretamente com o ${serviceInfo.name}. 
    
    O prompt deve ser:
    - Otimizado especificamente para o ${serviceInfo.name}
    - Claro e específico
    - Bem formatado
    - Incluir todos os detalhes relevantes
    - Pronto para uso imediato
    - Considerar as capacidades e limitações do ${serviceInfo.name}
    
    Retorne apenas o prompt final, sem explicações adicionais.
    `;

    return await this.sendMessage(prompt, service, 800);
  }

  /**
   * Retorna a lista de serviços disponíveis
   * @returns {Object} - Objeto com informações dos serviços
   */
  getAvailableServices() {
    return this.services;
  }

  /**
   * Valida se um serviço é suportado
   * @param {string} service - O serviço a ser validado
   * @returns {boolean} - True se o serviço é suportado
   */
  isServiceSupported(service) {
    return this.services.hasOwnProperty(service);
  }

  /**
   * Retorna informações detalhadas sobre um serviço específico
   * @param {string} service - O serviço solicitado
   * @returns {Object|null} - Informações do serviço ou null se não encontrado
   */
  getServiceInfo(service) {
    return this.services[service] || null;
  }
}

// Exporta uma instância única do cliente
module.exports = new AIClient(); 