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

    let { 
        prompt, 
        hashtags, 
        thread, 
        emojis, 
        temperature, 
        reply, 
        links, 
        length,
        hook,
        question,
        cta,
    } = getQuery(event)

    let props = getQuery(event)

    console.log(length)
    let parsedLength = JSON.parse((length !== undefined && length !== null) ? length.toString() : '{"start": 140, "end": 280}')

    console.log(getQuery(event))

    let finalPrompt = `Write a 
                        ${thread === 'true' ? 'twitter thread about' : `tweet ${question === 'true' ? 'asking about' : 'about'}`}
                        ${reply === 'true' ? 'reply to the following' : ''} 
                        ${prompt}. Make sure you follow all the following rules. 
                        ${hashtags === 'true' ? '' : 'DO NOT'} use hashtags, 
                        ${emojis === 'true' ? '' : 'DO NOT'} use emojis. 
                        ${links === 'true' ? '' : 'DO NOT'} use links. Make sure the length is between 
                        ${parsedLength.start} and 
                        ${parsedLength.end} charcters if it's a thread. 
                        ${hook === 'true' ? 'Make sure you start with a hooking line, tweet, or sentence.' : ''} 
                        ${cta ==='true' ? 'Add a call to action at the end!' : ''}
    `.replaceAll('\n', '')
    finalPrompt = finalPrompt.replaceAll(/\s\s+/g, ' ')
    
    console.log(finalPrompt)

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

    let removeNewlineSetting = ''

    if (completion.data.choices[0].text !== undefined) {
        if (completion.data.choices[0].text[0] === '\n')
            removeNewlineSetting = '\n'

        if (completion.data.choices[0].text[1] === '\n')
            removeNewlineSetting = '\n\n'
    }

    let result = {
        prompt: prompt,
        options: props,
        response: completion.data.choices[0].text?.replace(`${removeNewlineSetting}`, '') + (temperature === '1' ? ' 🔥 ' : ''),
    }

    console.log(`Data: ${JSON.stringify(result)}`)

    return {
        prompt: result.prompt,
        options: result.options,
        response: result.response,
    }
})