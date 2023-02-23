export const defaultOptions: Options = {thread: "false", hashtags: "false", emojis: "false", temperature: "0", reply: "false", links: "false"}

export type Options = {
    thread: string, 
    hashtags: string, 
    emojis: string, 
    temperature: string, 
    reply: string, 
    links: string
}

export async function openAIFetch(prompt: string, options: Options) {
    return await useFetch(`/api/openai?prompt=${prompt}&hashtags=${options.hashtags}&thread=${options.thread}&emojis=${options.emojis}&reply=${options.reply}&temperature=${options.temperature}&links=${options.links}`)
}

export function getPositiveNotification(content: string) {
    return {color: '#0af', content: content}
}

export function getNegativeNotification(content: string) {
    return {color: '#f30', content: content}
}