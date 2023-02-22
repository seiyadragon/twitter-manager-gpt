import { Configuration, OpenAIApi } from "openai";

export default defineEventHandler(async (event) => {
    let {passed} = await $fetch("/api/limiter")

    if (!passed) 
        return {
            prompt: "Limit reached",
            options: {thread: false, hashtags: false, emojis: false},
            response: "The rate limit for the day has been reached!",
        }

    let openaiKey = process.env.OPENAIKEY
    let { prompt, hashtags, thread, emojis, temperature, reply, links } = getQuery(event)

    const finalPrompt = `Write a 
                        ${thread === 'true' ? 'twitter thread' : 'tweet'} 
                        ${reply === 'true' ? 'reply to the following' : ''} 
                        ${hashtags === 'true' ? '' : 'do not'} use hashtags, 
                        ${emojis === 'true' ? '' : 'do not'} use emojis. 
                        ${links === 'true' ? '' : 'do not'} use links.
                        ${prompt} `

    const configuration = new Configuration({
        apiKey: openaiKey,
    });

    const openai = new OpenAIApi(configuration)

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: finalPrompt,
        max_tokens: thread === 'true' ? 1400 : 70,
        temperature: parseInt(temperature as string),
    });

    return {
        prompt: prompt,
        options: {thread, hashtags, emojis, reply, temperature, links},
        response: completion.data.choices[0].text + (temperature === '1' ? ' 🔥 ' : ''),
    }
})