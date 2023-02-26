import { Configuration, OpenAIApi } from "openai";
import { defaultOptions, Options, openAIFetch } from '~~/util/Util';

export default defineEventHandler(async (event) => {
    let limitKey = process.env.LMTKEY
    let {passed} = await $fetch(`/api/limiter?key=${limitKey}`)

    if (!passed) 
        return {
            prompt: "Limit",
            options: defaultOptions,
            response: "The rate limit for the day has been reached!",
        }

    let openaiKey = process.env.OPENAIKEY

    let { prompt, hashtags, thread, emojis, temperature, reply, links, length } = getQuery(event)
    let parsedLength = JSON.parse(((length !== undefined && length !== null) ? length : "").toString())

    console.log(getQuery(event))

    const finalPrompt = `Write a 
                        ${thread === 'true' ? 'twitter thread' : 'tweet'} 
                        ${reply === 'true' ? 'reply to the following' : ''} 
                        ${hashtags === 'true' ? '' : 'do not'} use hashtags, 
                        ${emojis === 'true' ? '' : 'do not'} use emojis. 
                        ${links === 'true' ? '' : 'do not'} use links. Make sure the length is between 
                        ${parsedLength.start} and 
                        ${parsedLength.end} charcters if it's a thread. 
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

    let result = {
        prompt: prompt,
        options: {thread, hashtags, emojis, reply, temperature, links},
        response: completion.data.choices[0].text + (temperature === '1' ? ' 🔥 ' : ''),
    }

    console.log(`Data: ${JSON.stringify(result)}`)

    return {
        prompt: result.prompt,
        options: result.options,
        response: result.response,
    }
})