import { OpenRouter } from '@openrouter/sdk';
import {config} from 'dotenv'
config();

 
const client = new OpenRouter({
  apiKey: process.env.OpenRouterAPI
});

export const deepseekAsk = async(query) => {

    try {

        const completion = await client.chat.send({
        chatRequest:{
            model: 'deepseek/deepseek-v3.2',
            messages: [
              {
                role: 'user',
                content: `Given DSA problem:
                                 ${query}
                                 Return ONLY:
                            - algorithmic patterns
                            - data structures
                            - important techniques
                                 Under 25 words.`,
                },
                ],
            }
        });
        return completion.choices[0].message.content;
    
    } catch (error) {
        console.log('error in deepseekAsk', error);
        return;
    }

    
}
