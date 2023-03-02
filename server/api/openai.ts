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
    `.replaceAll('\n', '').replaceAll(/\s\s+/g, ' ')

    console.log(finalPrompt)

    let systemRole = `
        You are an exact clone of OpenAI's text-davinci-003 and you generate responses exactly like it! 
        Your specific role is to create Twitter posts and it's very important that you follow the rules. 
        Never use hashtags in the Tweet unless told to do so.
    `.replaceAll('\n', '').replaceAll(/\s\s+/g, ' ')

    try {
        const optionsBody = {
            model: "gpt-3.5-turbo",
            max_tokens: thread === 'true' ? 1400 : 70,
            temperature: parseInt(temperature as string),
            messages: [
                {"role": "system", "content": `${systemRole}`},
                {"role": "user", "content": `${finalPrompt}`}
            ]
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openaiKey}`,
            },
            body: JSON.stringify(optionsBody)
        }

        var chat: any = await (await fetch("https://api.openai.com/v1/chat/completions", options as any)).json()

    } catch (exception) {
        console.log(exception)
    }

    /*const configuration = new Configuration({
        apiKey: openaiKey,
    });

    const openai = new OpenAIApi(configuration)

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: finalPrompt,
        max_tokens: thread === 'true' ? 1400 : 70,
        temperature: parseInt(temperature as string),
    });*/

    let finalResponse = chat.choices[0].message.content.toString()

    let removeNewlineSetting = ''

    if (finalResponse !== undefined) {
        if (finalResponse[0] === '\n')
            removeNewlineSetting = '\n'

        if (finalResponse[1] === '\n')
            removeNewlineSetting = '\n\n'

        if (hashtags !== 'true') {
            let splitResponse = finalResponse.toString().split(' ')
            let tempResponse = ''
            console.log(splitResponse)

            for (let i = 0; i < splitResponse.length; i++) {
                if (splitResponse[i].charAt(0) !== '#') 
                    tempResponse = tempResponse.concat((i > 0 ? ' ' : '') + splitResponse[i])
            }

            console.log(tempResponse)

            finalResponse = tempResponse
        }
    } else
        return {
            prompt: prompt,
            options: props,
            response: 'Could not genereate a response 😔'
        }

    let result = {
        prompt: prompt,
        options: props,
        response: finalResponse.replace(`${removeNewlineSetting}`, '') + (temperature === '1' ? ' 🔥 ' : ''),
    }

    console.log(`Data: ${JSON.stringify(result)}`)

    return {
        prompt: result.prompt,
        options: result.options,
        response: result.response,
    }
})