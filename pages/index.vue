<template>
    <section>
        <Box title="Tweet">
            <div class="box-flex">
                <div>
                    <Checkbox label="hashtags" @onTicked="(ticked) => hashtags = ticked"/>
                    <Checkbox label="emojis" @onTicked="(ticked) => emojis = ticked"/>
                </div>
                <div>
                    <Checkbox label="thread" @onTicked="(ticked) => thread = ticked"/>
                    <Checkbox label="reply" @onTicked="(ticked) => reply = ticked"/>
                </div>
                <div>
                    <Checkbox label="links" @onTicked="(ticked) => links = ticked" />
                    <Checkbox label="hot" @onTicked="(ticked) => hot = ticked"/>
                </div>
            </div>
            <p>Type your tweet prompt here:</p>
            <div ref="textRef" :contenteditable="true" class="prompt" :value="promptText" @input="onPromptInput"/>
            <Button @click="onSubmitClick">
                Get your tweet!
            </Button>
            <p class="error">{{ errorMessage }}</p>
        </Box>
        <div v-for="res in responses">
            <Tweet :res="res" @tweetDeleted="deleteTweet" @tweetRegenerated="regenerateTweet" @tweetEdited="editTweet" @tweetRegenStart="tweetRegenStart"/>
        </div>
        <div class="filler">

        </div>
    </section>
</template>

<script lang="ts">
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

    export default {
        methods: {
            onPromptInput(event: any) {
                this.promptText = event.target.innerText
            },
            async onSubmitClick() {
                (this.$refs.textRef as HTMLDivElement).innerText = ""

                let dontContinue = false

                this.responses.map((res) => {
                    if (this.promptText === res.prompt)
                        dontContinue = true
                })

                if (dontContinue) {
                    this.errorMessage = "You already have this prompt. Please regenerate it!"
                    return
                }

                this.errorMessage = ""
                this.responses.push({prompt: this.promptText, options: defaultOptions, response: "Loading..."})

                let { data } = await openAIFetch(this.promptText, {
                    thread: (this.thread).toString(),
                    hashtags: (this.hashtags).toString(),
                    emojis: (this.emojis).toString(),
                    temperature: (this.hot ? '1' : '0'),
                    reply: (this.reply).toString(),
                    links: (this.links).toString(),
                })
                let builtData = {
                    prompt: (data.value?.prompt)?.toString(),
                    options: (data.value?.options) as Options,
                    response: (data.value?.response)?.toString(),
                }
                let definedData = {
                    prompt: builtData.prompt !== undefined ? builtData.prompt : "",
                    options: builtData.options !== undefined ? builtData.options : defaultOptions,
                    response: builtData.response !== undefined ? builtData.response : "",
                }
                
                this.responses[this.responses.length - 1] = definedData
                //this.responses.push(definedData)
                this.promptText = "";
            },
            deleteTweet(res: any) {
                this.responses.map((response, index) => {
                    if (res.prompt === response.prompt) 
                        this.responses.splice(index, 1)
                })

                this.updateLocalStorage()
            },
            regenerateTweet(data: any) {
                this.responses.map((response, index) => {
                    if (data.prompt === response.prompt) {
                        this.responses[index] = data
                    }
                })

                this.updateLocalStorage()
            },
            tweetRegenStart(prompt: string) {
                this.responses.map((response, index) => {
                    if (prompt === response.prompt) {
                        this.responses[index] = {prompt: prompt, options: defaultOptions, response: "Loading..."}

                        this.updateLocalStorage()
                    }
                })
            },
            updateLocalStorage() {
                if (process.client) {
                    let storedRes = [] as Array<{prompt: string, options: Options, response: string}>
                    let lsString = localStorage.getItem('tweets')
                    let ls = JSON.parse(lsString !== null ? lsString : '')

                    this.responses.map((res) => {
                        ls.map((lsi: any) => {
                            if (res.prompt === lsi.prompt)
                                storedRes.push(res)
                        })
                    })

                    localStorage.setItem('tweets', JSON.stringify(storedRes))
                }
            },
            editTweet({text, res}: any) {
                this.responses.map((response, index) => {
                    if (res.prompt === response.prompt) {
                        this.responses[index].response = text
                    }
                })

                this.updateLocalStorage()
            },
        },
        data() {
            return {
                promptText: "",
                responses: [] as Array<{prompt: string, options: Options, response: string}>,
                errorMessage: "",
                hashtags: false,
                thread: false,
                emojis: false,
                reply: false,
                hot: false,
                links: false,
            }
        },
        mounted() {
            if (process.client) {
                let tweets = localStorage.getItem('tweets')
                let tweetsParsed = JSON.parse(tweets !== null ? tweets : "[]")

                if (tweetsParsed.length > 0)
                    this.responses = tweetsParsed
            }
        },
    }
</script>

<style lang="scss">
    .error {
        color: red;
        padding-top: 8px;
        margin-bottom: 0px;
    }

    .box-flex {
        display: flex;
        justify-content: space-between;
    }

    .filler {
        transition: height 500ms ease-in-out;
        height: v-bind('((2 - responses.length) * 120).toString() + "px"');
        border-left: dashed 1px gray;
        border-right: dashed 1px gray;
        margin-top: 24px;
    }
</style>
