
export type Options = {
    thread: string, 
    hashtags: string, 
    emojis: string, 
    temperature: string, 
    reply: string, 
    links: string,
    length: string,
    hook: string,
    question: string,
    cta: string,
    userid: string,
}

export const defaultOptions: Options = {
    thread: "false", 
    hashtags: "false", 
    emojis: "false", 
    temperature: "0", 
    reply: "false", 
    links: "false", 
    length: '{"start": 140, "end": 280}',
    hook: 'false',
    question: 'false',
    cta: 'false',
    userid: '',
}

export type TweetData = {
    prompt: string, 
    options: Options, 
    response: string,
}

export async function openAIFetch(prompt: string, options: Options) {
    let request = `/api/openai
        ?prompt=${escape(prompt)}
            &hashtags=${options.hashtags}
            &thread=${options.thread}
            &emojis=${options.emojis}
            &reply=${options.reply}
            &temperature=${options.temperature}
            &links=${options.links}
            &length=${options.length}
            &hook=${options.hook}
            &question=${options.question}
            &cta=${options.cta}
            &userid=${options.userid}
    `.replaceAll('\n', '').replaceAll(/\s\s+/g, '')

    console.log(request)

    return await useFetch(request.toString())
}

export function getPositiveNotification(content: string) {
    return {color: '#0af', content: content}
}

export function getNegativeNotification(content: string) {
    return {color: '#f30', content: content}
}