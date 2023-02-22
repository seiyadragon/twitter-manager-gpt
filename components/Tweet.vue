<template>
    <Box :title="res.prompt">
        <p ref="tweetBody" :contenteditable="isEditable" class="tweet-text" :class="isEditable ? 'edit' : ''">{{ res.response }}</p>
        <div class="tweet-buttons">
            <a :href="`https://twitter.com/intent/tweet?text=${res.response}`" data-size="large" class="tweet-button">
                <Button class="button">
                    <Icon name="ion:logo-twitter" />
                </Button>
            </a>
            <div class="tweet-button">
                <Button class="button" @click="onCopyClick">
                    <Icon name="ion:copy" />
                </Button>
            </div>
            <div class="tweet-button">
                <Button class="button" @click="saveTweet">
                    <Icon name="ion:save" />
                </Button>
            </div>
            <div class="tweet-button">
                <Button class="button" @click="() => {isEditable = !isEditable; $emit('tweetEdited', {text: ($refs.tweetBody as HTMLDivElement).innerText, res: res})}">
                    <Icon name="ion:edit" />
                </Button>
            </div>
            <div class="tweet-button">
                <Button class="button" @click="regenerateTweet">
                    <Icon name="ion:sync" />
                </Button>
            </div>
            <div class="tweet-button">
                <Button class="button" @click="() => $emit('tweetDeleted', res)">
                    <Icon name="ion:close" />
                </Button>
            </div>
        </div>
    </Box>
</template>

<script lang="ts">
    import { defaultOptions, Options, openAIFetch } from '~~/pages/index.vue'

    export default {
        props: [
            'res',
        ],
        methods: {
            onCopyClick() {
                navigator.clipboard.writeText(this.res.response)
            },
            async regenerateTweet() {
                this.$emit('tweetRegenStart', this.res.prompt)

                let { data } = await openAIFetch(this.res.prompt, {
                    thread: this.res.thread,
                    hashtags: this.res.hashtags,
                    emojis: this.res.emojis,
                    temperature: this.res.temperature,
                    reply: this.res.reply,
                    links: this.res.links,
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
                let counter = 0

                while (this.res.response === definedData.response) {
                    let { data } = await openAIFetch(this.res.prompt, {
                        thread: this.res.thread,
                        hashtags: this.res.hashtags,
                        emojis: this.res.emojis,
                        temperature: this.res.temperature,
                        reply: this.res.reply,
                        links: this.res.links,
                    })
                    builtData = {
                        prompt: (data.value?.prompt)?.toString(),
                        options: (data.value?.options) as Options,
                        response: (data.value?.response)?.toString(),
                    }
                    definedData = {
                        prompt: builtData.prompt !== undefined ? builtData.prompt : "",
                        options: builtData.options !== undefined ? builtData.options : defaultOptions,
                        response: builtData.response !== undefined ? builtData.response : "",
                    }

                    counter++
                }

                this.$emit('tweetRegenerated', definedData)
            },
            saveTweet() {
                if (process.client) {
                    let tweets = localStorage.getItem('tweets')
                    let tweetsParsed = JSON.parse(tweets !== null ? tweets : "[]") as Array<any>;
                    
                    let shouldStop = false
                    let newTweets = [] as Array<number>

                    tweetsParsed.map((tweet) => {
                        if (tweet.prompt === this.res.prompt) 
                            shouldStop = true
                        else
                            newTweets.push(tweet)
                    })

                    if (!shouldStop)
                        newTweets.push(this.res)

                    localStorage.setItem('tweets', JSON.stringify(newTweets))
                }
            },
        },
        data() {
            return {
                isEditable: false,
            }
        },
    }
</script>

<style lang="scss">
    .tweet-buttons {
        display: flex;
        justify-content: space-between;

        @media (min-width: 720px) {
            justify-content: left;
            column-gap: 24px;
        }

        .tweet-button {
            display: block;
            width: 48px;
            padding-top: 0px;
    
            .button {
                margin-top: 0px;
                margin-bottom: 0px;
                padding-top: 12px;
            }
        }
    }

    .tweet-text {
        margin-bottom: 0px;
    }

    .edit {
        border-bottom: solid 1px black;

        &:focus {
            outline: none;
        }
    }
</style>