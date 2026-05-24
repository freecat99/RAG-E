import { OpenRouter } from '@openrouter/sdk';
import ollama from 'ollama';
import {config} from 'dotenv'
config();

 
const client = new OpenRouter({
  apiKey: process.env.OpenRouterAPI
});

export const hyde = async(query) => {

    try {

        const completion = await client.chat.send({
        chatRequest:{
            model: 'arcee-ai/trinity-large-thinking:free',
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

export const llmGen = async(question, retrieval) => {

    try {

        const completion = await client.chat.send({
        chatRequest:{
            model: 'arcee-ai/trinity-large-thinking:free',
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


export const ollamaHyde = async(query) => {

    try {

        
        const response = await ollama.chat({
            model: 'qwen2.5-coder:1.5b',
            
            messages: [{
                role: 'user',
                content: `Given DSA problem: ${query}
                
                Return ONLY:
                - algorithmic patterns
                - data structures
                - important techniques
                
                Under 25 words.`
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
                            "concepts": []
                            }`
            }]
        });

        return extractJSON(response.message.content); // ✅ parse here, return object

    } catch (error) {
        console.log('error in ollamaGen', error);
        return null;
    }   
}

// ── helper ──────────────────────────────────────────────
function extractJSON(raw) {
    // Strip ```json ... ``` or ``` ... ``` fences
    const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    let text = fenceMatch ? fenceMatch[1] : raw;

    // Isolate the first { ... } block (ignores any stray leading/trailing text)
    const start = text.indexOf('{');
    const end   = text.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('No JSON object found in response');

    return JSON.parse(text.slice(start, end + 1));
}

