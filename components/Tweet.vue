<template>
    <Box :title="res.prompt" :closing="closing">
        <div class="tweet-body">
            <p ref="tweetBody" :contenteditable="isEditable" class="tweet-text" :class="isEditable ? 'edit' : ''">{{ res.response }}</p>
            <img src="/fidget-spinner.gif" alt="Loading fidget spinner" v-if="res.response === 'Loading...'">
            <div class="tweet-buttons">
                <div class="tweet-button">
                    <Button class="button" @buttonClick="tweetTweet">
                        <a ref="tweetLinkAnchor" :href="`https://twitter.com/intent/tweet?text=${res.response}`" data-size="large">
                            <Icon name="ion:logo-twitter" />
                        </a>
                    </Button>
                </div>
                <div class="tweet-button">
                    <Button class="button" @buttonClick="onCopyClick">
                        <Icon name="ion:copy" />
                    </Button>
                </div>
                <div class="tweet-button">
                    <Button class="button" @buttonClick="saveTweet">
                        <Icon name="ion:save" />
                    </Button>
                </div>
                <div class="tweet-button">
                    <Button class="button" @buttonClick="editTweet">
                        <Icon name="ion:edit" />
                    </Button>
                </div>
                <div class="tweet-button">
                    <Button class="button" @buttonClick="regenerateTweet">
                        <Icon name="ion:sync" />
                    </Button>
                </div>
                <div class="tweet-button">
                    <Button class="button" @buttonClick="onClose">
                        <Icon name="ion:close" />
                    </Button>
                </div>
            </div>
        </div>
    </Box>
</template>

<script lang="ts">
    import { defaultOptions, Options, openAIFetch, getPositiveNotification, getNegativeNotification } from '~~/util/Util'

    export default {
        props: [
            'res',
        ],
        methods: {
            onCopyClick() {
                navigator.clipboard.writeText(this.res.response)

                this.$emit('notification', getPositiveNotification('Tweet copied!'))
            },
            async regenerateTweet() {
                let lastResponse = this.res.response
                this.$emit('tweetRegenStart', this.res.prompt)
                this.$emit('notification', getPositiveNotification('Tweet regeneration started!'))

                this.height = this.res.options.length.end * 24;

                let { data } = await openAIFetch(this.res.prompt, this.res.options)
                let response = (data.value?.response)?.toString()
                let builtData = {
                    prompt: this.res.prompt,
                    options: this.res.options,
                    response: response !== undefined ? response : "",
                }

                console.log(this.res.response)
                console.log(builtData.response)

                let counter = 0

                while (lastResponse === builtData.response) {
                    console.log(builtData.response.toString())

                    let { data } = await openAIFetch(this.res.prompt, counter < 3 ? this.res.options : defaultOptions.temperature = '1')

                    let response = (data.value?.response)?.toString()

                    builtData = {
                        prompt: this.res.prompt,
                        options: this.res.options,
                        response: response !== undefined ? response : "",
                    }

                    if (counter > 6) 
                        break

                    counter++ 
                }

                this.$emit('tweetRegenerated', builtData)
                this.$emit('notification', getPositiveNotification('Tweet regenerated!'))

                console.log(this.res.response)
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
                    this.$emit('notification', getPositiveNotification('Tweet saved!'))
                }
            },
            async onClose() {
                this.closing = true
                this.$emit('notification', getNegativeNotification('Tweet removed!'))

                setTimeout(() => {
                    this.$emit('tweetDeleted', this.res)
                    this.closing = false
                }, 250)
            },
            editTweet() {
                this.isEditable = !this.isEditable
                this.$emit('tweetEdited', {text: (this.$refs.tweetBody as HTMLDivElement).innerText, res: this.res})

                if (!this.isEditable)
                    this.$emit('notification', getPositiveNotification('Tweed edited!'))
            },
            tweetTweet() {
                (this.$refs.tweetLinkAnchor as HTMLAnchorElement).click()
                this.$emit('notification', getPositiveNotification('Tweet tweeted!'))
            },
        },
        data() {
            return {
                isEditable: false,
                closing: false,
                height: 0,
            }
        },
        mounted() {
            this.height = this.res.options.length.end * 24 + (32 * 8);
            console.log(this.height)
        }
    }
</script>

<style lang="scss" scoped>
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
            height: 48px;
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
        white-space: pre-wrap;
    }

    .edit {
        border-bottom: solid 1px black;

        &:focus {
            outline: none;
        }
    }
</style>