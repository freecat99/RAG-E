import { OpenRouter } from '@openrouter/sdk';
import {config} from 'dotenv'
config();

 
const client = new OpenRouter({
  apiKey: process.env.OpenRouterAPI
});

export const llmHyde = async(query) => {

    try {

        const completion = await client.chat.send({
        chatRequest:{
            model: 'openai/gpt-oss-20b:free',
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
        console.log('error in llmHyde', error);
        return;
    }   
}

export const llmGen = async(question, retrieval) => {

    try {

        const completion = await client.chat.send({
        chatRequest:{
            model: 'openai/gpt-oss-20b:free',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert competitive programming mentor. Use ONLY the retrieved concepts to explain the approach. Keep the answer concise,technical, and educational.`

                },{
                    role: "user",
                    content: `Problem: ${question}
                              Retrieved Concepts: ${retrieval}

                                Tasks:
                                1. Explain the approach
                                2. Mention important pattern
                                3. Mention time complexity

                                Under 100-120 words.
                                Return ONLY valid JSON:

                                    {
                                    "pattern": "",
                                    "approach": "",
                                    "complexity": "",
                                    "concepts": []
                                    }`,
                },
                ],
            }
        });
        return completion.choices[0].message.content;
    
    } catch (error) {
        console.log('error in llmGen', error);
        return;
    }   
}
