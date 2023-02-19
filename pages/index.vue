<template>
    <section>
        <Box title="Tweet">
            <Checkbox label="hashtags" @onTicked="(ticked) => hashtags = ticked"/>
            <Checkbox label="thread" @onTicked="(ticked) => thread = ticked"/>
            <Checkbox label="emojis" @onTicked="(ticked) => emojis = ticked"/>
            <p>Type your tweet prompt here:</p>
            <div ref="textRef" :contenteditable="true" class="prompt" :value="promptText" @input="onPromptInput"/>
            <Button @click="onSubmitClick">
                Get your tweet!
            </Button>
            <p class="error">{{ errorMessage }}</p>
        </Box>
        <div v-for="res in responses">
            <Tweet :res="res" @tweetDeleted="deleteTweet" @tweetRegenerated="regenerateTweet"/>
        </div>
    </section>
</template>

<script lang="ts">
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

                let { data } = await useFetch(`/api/openai?prompt=${this.promptText}&hashtags=${this.hashtags}&thread=${this.thread}&emojis=${this.emojis}`)
                let builtData = {
                    prompt: (data.value?.prompt)?.toString(),
                    options: (data.value?.options) as {thread: string, hashtags: string, emojis: string},
                    response: (data.value?.response)?.toString(),
                }
                let definedData = {
                    prompt: builtData.prompt !== undefined ? builtData.prompt : "",
                    options: builtData.options !== undefined ? builtData.options : {thread: "false", hashtags: "false", emojis: "false"},
                    response: builtData.response !== undefined ? builtData.response : "",
                }
                
                this.responses.push(definedData)

                this.promptText = "";
            },
            deleteTweet(res: any) {
                this.responses.map((response, index) => {
                    if (res.prompt === response.prompt) 
                        this.responses.splice(index, 1)
                })
            },
            regenerateTweet(data: any) {
                this.responses.map((response, index) => {
                    if (data.prompt === response.prompt) {
                        this.responses[index] = data
                    }
                })
            },
        },
        data() {
            return {
                promptText: "",
                responses: [] as Array<{prompt: string, options: {thread: string, hashtags: string, emojis: string}, response: string}>,
                errorMessage: "",
                hashtags: false,
                thread: false,
                emojis: false,
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
    }
</style>
