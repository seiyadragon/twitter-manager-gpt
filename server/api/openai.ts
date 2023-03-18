import { Configuration, OpenAIApi } from "openai";
import { defaultOptions, Options, openAIFetch } from '~~/util/Util';

export default defineEventHandler(async (event) => {
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
        userid,
    } = getQuery(event)

    let limitKey = process.env.LMTKEY
    let {passed, free} = await $fetch(`/api/limiter?key=${limitKey}&userid=${userid}`)

    if (!passed) 
        return {
            prompt: "Limit",
            options: defaultOptions,
            response: "The rate limit for the day has been reached!",
        }

    let openaiKey = process.env.OPENAIKEY

    let props = getQuery(event)

    console.log(length)
    let parsedLength = JSON.parse((length !== undefined && length !== null) ? length.toString() : '{"start": 140, "end": 280}')

    console.log(getQuery(event))
    
    if (free) {
        hashtags = "false"
        thread = "false"
        emojis = "false"
        temperature = "false" 
        reply = "false" 
        links = "false" 
        length = "false"
        hook = "false"
        question = "false"
        cta = "false"
        length = defaultOptions.length
    }

    let finalPrompt = prompt?.toString().replaceAll('\n', '').replaceAll(/\s\s+/g, ' ')

    console.log(finalPrompt)

    let systemRole = `
        You write or edit user tweets, thread or replys based on what they choose in their prompt.
        Your response should always try to match the tone of the prompt. 
        Write a ${thread === 'true' ? 'twitter thread about' : `tweet ${question === 'true' ? 'asking about' : 'about'}`}
        ${reply === 'true' ? 'reply to the following' : ''} 
        the prompt. Make sure you follow all the following rules. 
        ${hashtags === 'true' ? '' : 'DO NOT'} use hashtags, 
        ${emojis === 'true' ? '' : 'DO NOT'} use emojis. 
        ${links === 'true' ? '' : 'DO NOT'} use links. Make sure the length is between 
        ${parsedLength.start} and 
        ${parsedLength.end} charcters if it's a thread. 
        ${hook === 'true' ? 'Make sure you start with a short, hooking line.' : ''} 
        ${cta ==='true' ? 'Add a call to action at the end!' : ''}
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
        response: finalResponse.replace(`${removeNewlineSetting}`, ''),
    }

    console.log(`Data: ${JSON.stringify(result)}`)

    return {
        prompt: result.prompt,
        options: result.options,
        response: result.response,
    }
})