export const defaultOptions: Options = {thread: "false", hashtags: "false", emojis: "false", temperature: "0", reply: "false", links: "false", length: '{"start": 140, "end": 280}'}

export type Options = {
    thread: string, 
    hashtags: string, 
    emojis: string, 
    temperature: string, 
    reply: string, 
    links: string,
    length: string,
}

export async function openAIFetch(prompt: string, options: Options) {
    return await useFetch(`/api/openai?prompt=${escape(prompt)}&hashtags=${options.hashtags}&thread=${options.thread}&emojis=${options.emojis}&reply=${options.reply}&temperature=${options.temperature}&links=${options.links}&length=${options.length}`)
}

export function getPositiveNotification(content: string) {
    return {color: '#0af', content: content}
}

export function getNegativeNotification(content: string) {
    return {color: '#f30', content: content}
}