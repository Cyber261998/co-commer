import { OpenAI } from '@langchain/openai';
import Redis from 'ioredis';
import { ChatOpenAI } from '@langchain/openai';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';

// Initialize Redis client
const redis = new Redis({
  host: 'localhost', // Update with your Redis host
  port: 6379,        // Update with your Redis port
});

export class ChatbotService {
  private model: ChatOpenAI;
  private memory: BufferMemory;
  private chain: ConversationChain;

  constructor() {
    this.model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.7,
      modelName: 'gpt-3.5-turbo',
    });

    this.memory = new BufferMemory();
    this.chain = new ConversationChain({
      llm: this.model,
      memory: this.memory,
    });
  }

  async saveMessage(sessionId: string, role: 'user' | 'assistant', content: string) {
    const timestamp = Date.now();
    await redis.lpush(
      `chat:${sessionId}`,
      JSON.stringify({ role, content, timestamp })
    );
  }

  async getMessages(sessionId: string, limit = 50) {
    const messages = await redis.lrange(`chat:${sessionId}`, 0, limit - 1);
    return messages.map(msg => JSON.parse(msg));
  }

  async chat(sessionId: string, message: string) {
    // Save user message
    await this.saveMessage(sessionId, 'user', message);

    // Get response from OpenAI
    const response = await this.chain.call({
      input: message,
    });

    // Save assistant response
    await this.saveMessage(sessionId, 'assistant', response.response);

    return response.response;
  }
} 