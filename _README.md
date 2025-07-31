# 🤖 Agente de IA para Criação de Prompts

Um servidor Node.js com Express que funciona como um agente de IA para ajudar usuários leigos a criarem prompts melhores para o ChatGPT.

## 📋 Funcionalidades

- **Suporte a múltiplos serviços de IA**: ChatGPT, Claude, Gemini, Llama
- **Processo em duas etapas**: Primeiro gera perguntas para entender melhor a intenção, depois cria um prompt final
- **Prompts otimizados**: Cada serviço recebe prompts específicos para suas capacidades
- **Modelo único**: Sempre usa GPT-4 para gerar perguntas e prompts, garantindo qualidade consistente
- **API RESTful**: Endpoints bem documentados e fáceis de usar
- **Interface Web Moderna**: Interface responsiva e intuitiva para usuários
- **Arquitetura em camadas**: Separação clara entre rotas, serviços e utilitários
- **Tratamento de erros**: Sistema robusto de tratamento de erros
- **Health checks**: Monitoramento do status do serviço

## 🏗️ Estrutura do Projeto

```
ai-prompt-agent/
├── index.js                 # Servidor principal
├── routes/
│   └── promptBuilder.js     # Rotas da API
├── services/
│   └── promptService.js     # Lógica de negócio
├── utils/
│   └── openaiClient.js      # Cliente da OpenAI
├── public/                  # Interface web
│   ├── index.html          # Página principal
│   ├── styles.css          # Estilos CSS
│   └── script.js           # JavaScript da interface
├── .env                     # Variáveis de ambiente
├── env.example             # Exemplo das variáveis
├── package.json            # Dependências
├── .gitignore              # Arquivos ignorados
└── README.md               # Documentação
```

## 🚀 Instalação

### Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn
- Chave da API da OpenAI

### Passos

1. **Clone o repositório** (se aplicável):
   ```bash
   git clone <url-do-repositorio>
   cd ai-prompt-agent
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   ```bash
   # Copie o arquivo de exemplo
   cp env.example .env
   
   # Edite o arquivo .env com suas configurações
   ```

4. **Configure sua chave da OpenAI**:
   - Abra o arquivo `.env`
   - Substitua `sua_chave_da_openai_aqui` pela sua chave real da API da OpenAI
   - Você pode obter uma chave em: https://platform.openai.com/api-keys
   - **Nota**: O sistema sempre usa o modelo GPT-4 para gerar perguntas e prompts, independentemente do serviço selecionado

## 🏃‍♂️ Como Executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

O servidor estará disponível em: `http://localhost:3000`

### Interface Web
Após iniciar o servidor, acesse `http://localhost:3000` no seu navegador para usar a interface web interativa.

## 🖥️ Interface Web

A aplicação inclui uma interface web moderna e responsiva com:

### **Características da Interface**
- **Design responsivo**: Funciona em desktop, tablet e mobile
- **Processo em 3 etapas**: Guia o usuário de forma intuitiva
- **Animações suaves**: Transições elegantes entre etapas
- **Feedback visual**: Loading states e notificações toast
- **Acessibilidade**: Suporte a navegação por teclado

### **Como Usar a Interface**

1. **Etapa 1**: Selecione o serviço de IA e digite sua intenção (ex: "quero fazer um post sobre café")
2. **Etapa 2**: Responda as 3 perguntas geradas pela IA
3. **Etapa 3**: Copie o prompt final gerado e use no serviço escolhido

### **Recursos da Interface**
- **Auto-resize**: Textareas se ajustam automaticamente
- **Atalhos de teclado**: Enter para submeter, Shift+Enter para nova linha
- **Copiar prompt**: Botão para copiar o prompt final
- **Criar novo**: Botão para começar um novo prompt
- **Navegação**: Botões para voltar e avançar

## 📚 Documentação da API

### Endpoints Disponíveis

#### 1. Obter Serviços Disponíveis
**GET** `/prompt/services`

Retorna a lista de todos os serviços de IA disponíveis.

**Resposta de sucesso:**
```json
{
  "success": true,
  "services": {
    "chatgpt": {
      "name": "ChatGPT",
      "model": "gpt-4",
      "description": "Modelo avançado da OpenAI, ideal para conversas e tarefas complexas"
    },
    "claude": {
      "name": "Claude",
      "model": "gpt-4",
      "description": "Modelo da Anthropic, excelente para análise e escrita criativa"
    },
    "gemini": {
      "name": "Gemini",
      "model": "gpt-4",
      "description": "Modelo do Google, ótimo para tarefas multidisciplinares"
    },
    "llama": {
      "name": "Llama",
      "model": "gpt-4",
      "description": "Modelo open source, bom para desenvolvimento e experimentação"
    }
  },
  "message": "Serviços disponíveis recuperados com sucesso"
}
```

#### 2. Obter Informações de um Serviço
**GET** `/prompt/services/:service`

Retorna informações detalhadas sobre um serviço específico.

**Resposta de sucesso:**
```json
{
  "success": true,
  "service": "chatgpt",
  "serviceInfo": {
    "name": "ChatGPT",
    "model": "gpt-4",
    "description": "Modelo avançado da OpenAI, ideal para conversas e tarefas complexas",
    "maxTokens": 4000,
    "temperature": 0.7
  },
  "message": "Informações do serviço recuperadas com sucesso"
}
```

#### 3. Iniciar Criação de Prompt
**POST** `/prompt/start`

Inicia o processo de criação de prompt gerando 3 perguntas para entender melhor a intenção do usuário.

**Corpo da requisição:**
```json
{
  "intention": "quero fazer um post sobre café",
  "service": "chatgpt"
}
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "intention": "quero fazer um post sobre café",
  "service": "chatgpt",
  "serviceInfo": {
    "name": "ChatGPT",
    "model": "gpt-4",
    "description": "Modelo avançado da OpenAI, ideal para conversas e tarefas complexas"
  },
  "questions": "1. Qual é o público-alvo do seu post sobre café?\n2. Que tipo de conteúdo você quer criar (educativo, promocional, pessoal)?\n3. Há algum aspecto específico do café que você quer destacar?",
  "message": "Perguntas geradas com sucesso"
}
```

#### 4. Completar Criação de Prompt
**POST** `/prompt/complete`

Completa o processo gerando um prompt final bem formatado baseado na intenção e respostas.

**Corpo da requisição:**
```json
{
  "intention": "quero fazer um post sobre café",
  "answers": [
    "Público geral interessado em café",
    "Conteúdo educativo sobre tipos de café",
    "Quero focar nos benefícios para a saúde"
  ],
  "service": "chatgpt"
}
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "intention": "quero fazer um post sobre café",
  "service": "chatgpt",
  "serviceInfo": {
    "name": "ChatGPT",
    "model": "gpt-4",
    "description": "Modelo avançado da OpenAI, ideal para conversas e tarefas complexas"
  },
  "answers": ["Público geral interessado em café", "Conteúdo educativo sobre tipos de café", "Quero focar nos benefícios para a saúde"],
  "finalPrompt": "Crie um post educativo sobre café focado nos benefícios para a saúde. O conteúdo deve ser direcionado ao público geral interessado em café. Inclua informações sobre diferentes tipos de café e seus benefícios específicos para a saúde, mantendo um tom acessível e informativo.",
  "message": "Prompt final gerado com sucesso"
}
```

#### 5. Health Check
**GET** `/prompt/health`

Verifica o status do serviço e da conexão com a OpenAI.

**Resposta:**
```json
{
  "success": true,
  "status": "healthy",
  "openai": "connected",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 6. Documentação da API
**GET** `/prompt`

Retorna a documentação completa da API.

#### 7. Health Check Geral
**GET** `/health`

Verifica o status geral do servidor.

## 🧪 Exemplos de Uso

### Usando a Interface Web
1. Acesse `http://localhost:3000`
2. Digite sua intenção
3. Responda as perguntas
4. Copie o prompt final

### Usando cURL

1. **Iniciar criação de prompt:**
```bash
curl -X POST http://localhost:3000/prompt/start \
  -H "Content-Type: application/json" \
  -d '{"intention": "quero escrever um email profissional"}'
```

2. **Completar criação de prompt:**
```bash
curl -X POST http://localhost:3000/prompt/complete \
  -H "Content-Type: application/json" \
  -d '{
    "intention": "quero escrever um email profissional",
    "answers": [
      "Para um cliente importante",
      "Sobre um projeto em atraso",
      "Tom formal mas amigável"
    ]
  }'
```

### Usando JavaScript/Fetch

```javascript
// Iniciar processo
const startResponse = await fetch('http://localhost:3000/prompt/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    intention: 'quero criar um roteiro de vídeo'
  })
});

const startData = await startResponse.json();
console.log('Perguntas:', startData.questions);

// Completar processo
const completeResponse = await fetch('http://localhost:3000/prompt/complete', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    intention: 'quero criar um roteiro de vídeo',
    answers: [
      'Para YouTube',
      'Sobre tecnologia',
      'Duração de 10 minutos'
    ]
  })
});

const completeData = await completeResponse.json();
console.log('Prompt final:', completeData.finalPrompt);
```

## 🔧 Desenvolvimento

### Scripts Disponíveis

- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento com nodemon
- `npm test` - Executa os testes (a ser implementado)

### Estrutura do Código

- **`index.js`**: Configuração do servidor Express, middleware e tratamento de erros
- **`routes/promptBuilder.js`**: Definição das rotas da API
- **`services/promptService.js`**: Lógica de negócio e validações
- **`utils/openaiClient.js`**: Cliente da OpenAI e funções de IA
- **`public/`**: Interface web (HTML, CSS, JavaScript)

## 🛡️ Segurança

- **Helmet.js**: Headers de segurança HTTP
- **CORS**: Configuração para requisições cross-origin
- **Validação de entrada**: Verificação de dados de entrada
- **Tratamento de erros**: Sistema robusto de tratamento de exceções

## 📝 Logs

O servidor registra automaticamente:
- Todas as requisições HTTP
- Erros de processamento
- Status de inicialização
- Problemas de conexão com a OpenAI

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar problemas ou tiver dúvidas:

1. Verifique se a chave da OpenAI está configurada corretamente
2. Teste o health check: `GET /prompt/health`
3. Verifique os logs do servidor
4. Abra uma issue no repositório

## 🔄 Changelog

### v2.1.0
- **Modelo único**: Sempre usa GPT-4 para gerar perguntas e prompts, garantindo qualidade consistente
- Otimização de performance e confiabilidade

### v2.0.0
- Suporte a múltiplos serviços de IA (ChatGPT, Claude, Gemini, Llama)
- Prompts otimizados para cada serviço
- Interface atualizada com seleção de serviços
- Novos endpoints para gerenciar serviços
- Documentação expandida

### v1.0.0
- Implementação inicial da API
- Interface web moderna e responsiva
- Endpoints para criação de prompts
- Integração com OpenAI GPT-4
- Sistema de health checks
- Documentação completa 