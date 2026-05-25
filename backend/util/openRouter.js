import { OpenRouter } from '@openrouter/sdk';
import ollama from 'ollama';
import {config} from 'dotenv'
config();

 
const client = new OpenRouter({
  apiKey: process.env.OpenRouterAPI
});

export const llmhyde = async(query) => {

    try {

        const completion = await client.chat.send({
        chatRequest:{
            model: 'baidu/cobuddy:free',
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
        console.log('error in ollamaHyde', error);
        return;
    }   
}

export const llmgen = async(question, retrieval) => {

    try {

        const completion = await client.chat.send({
        chatRequest:{
            model: 'baidu/cobuddy:free',
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
                                    "concepts": [],
                                    "similarQuestions":[]
                                    }`,
                },
                ],
            }
        });
        return completion.choices[0].message.content;
    
    } catch (error) {
        console.log('error in ollamaGen', error);
        return;
    }   
}


export const ollamaHyde = async(query) => {

    try {

        
        const response = await ollama.chat({
            model: 'qwen2.5-coder:1.5b',
            
            messages: [{
                role: 'user',
                content: `Given DSA problem: ${query}
                
                Rules:
                    - Mention ONLY directly relevant concepts
                    - Never invent advanced algorithms
                    - Use short tags only
                    - No explanations
                    - No sentences
                    - Comma separated only

                    Examples:
                    hashmap, counting
                    math, simulation
                    greedy, sorting

                    Maximum 6 tags.`
            }]
        });
        
        return response.message.content;
    
    } catch (error) {
        console.log('error in ollamaHyde', error);
        return;
    }   
}

export const ollamaGen = async(question, retrieval) => {

    try {

        const response = await ollama.chat({
            
            model: 'qwen2.5-coder:1.5b',

            messages: [{
                role: 'system',
                content: `You are an expert competitive programming mentor.
                Use ONLY the retrieved concepts to explain the approach.
                Keep the answer concise, technical, and educational.`
            },{
                role: 'user',
                content: `Problem: ${question}

                          Retrieved Concepts: ${retrieval}

                            Tasks:
                            1. Explain the approach
                            2. Mention important pattern
                            3. Mention time complexity

                            Under 100-120 words.

                            Return ONLY valid JSON with no extra text, no markdown, no backticks:
                            {
                            "pattern": "",
                            "approach": "",
                            "complexity": "",
                            "concepts": [],
                            "questions":[]
                            }`
            }]
        });
        console.log("json", response)
        return extractJSON(response.message.content); 

    } catch (error) {
        console.log('error in ollamaGen', error);
        return null;
    }   
}
function extractJSON(raw) {

    const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    let text = fenceMatch ? fenceMatch[1] : raw;

    const start = text.indexOf('{');
    const end   = text.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('No JSON object found in response');

    return JSON.parse(text.slice(start, end + 1));
}

