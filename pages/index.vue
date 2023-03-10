<template>
    <div class="notifications">
        <Notification v-for="(notification, index) in notificationList" :notification-color="notification.color" 
        :listPosition="index" @closed="onNotificationClose" :key="index" class="notification">
            <p>{{ notification.content }}</p>
        </Notification>
    </div>
    <section>
        <Box title="Tweet">
            <div v-if="user !== null">
                <div class="box-flex">
                    <div>
                        <Checkbox label="hashtags" @onTicked="(ticked) => tweetOptions.hashtags = ticked.toString()"/>
                        <Checkbox label="emojis" @onTicked="(ticked) => tweetOptions.emojis = ticked.toString()"/>
                        <Checkbox label="hook" @onTicked="(ticked) => tweetOptions.hook = ticked.toString()"/>
                    </div>
                    <div>
                        <Checkbox label="thread" @onTicked="(ticked) => tweetOptions.thread = ticked.toString()"/>
                        <Checkbox label="reply" @onTicked="(ticked) => tweetOptions.reply = ticked.toString()"/>
                        <Checkbox label="question" @onTicked="(ticked) => tweetOptions.question = ticked.toString()"/>
                    </div>
                    <div>
                        <Checkbox label="links" @onTicked="(ticked) => tweetOptions.links = ticked.toString()" />
                        <Checkbox label="hot" @onTicked="(ticked) => ticked ? tweetOptions.temperature = '1' : tweetOptions.temperature = '0'"/>
                        <Checkbox label="call to action" @onTicked="(ticked) => tweetOptions.cta = ticked.toString()"/>
                    </div>
                </div>
                <RangeSelector :min="1" :max="20" :initial="1" @valueChanged="(length: string) => tweetOptions.length = length"/>
            </div>
            <p>Type your tweet prompt here:</p>
            <div ref="textRef" :contenteditable="true" class="prompt" :value="promptText" @input="onPromptInput"/>
            <Button @click="onSubmitClick" :button-focus-color="buttonClickColor">
                Get your tweet!
            </Button>
        </Box>
        <div class="tweets">
            <div v-for="res in responses">
                <Tweet :res="res" 
                    @tweetDeleted="deleteTweet" 
                    @tweetRegenerated="regenerateTweet" 
                    @tweetEdited="editTweet" 
                    @tweetRegenStart="tweetRegenStart"
                    @notification="tweetNotification"
                />
            </div>
        </div>
        <Filler :tweets="responses.length" />
    </section>
</template>

<script lang="ts">
    import { defaultOptions, Options, openAIFetch, getPositiveNotification, getNegativeNotification, TweetData } from '~~/util/Util'

    export default {
        setup() {
            const user = useSupabaseUser()

            return {
                user,
            }
        },
        data() {
            return {
                promptText: "",
                responses: [] as Array<TweetData>,
                buttonClickColor: "#0af",
                tweetOptions: defaultOptions,
                notificationList: [] as Array<{color: string, content: string}>,
            }
        },
        mounted() {
            if (process.client) {
                let tweets = localStorage.getItem('tweets')
                let tweetsParsed = JSON.parse(tweets !== null ? tweets : "[]")

                if (tweetsParsed.length > 0) {
                    this.responses = tweetsParsed
                }
            }

            let user = useSupabaseUser()
            let auth = useSupabaseAuthClient()

            if (user.value !== null) {
                this.tweetOptions.userid = user.value.id
            }
        },
        methods: {
            onPromptInput(event: any) {
                this.promptText = event.target.innerText
            },
            async onSubmitClick() {
                (this.$refs.textRef as HTMLDivElement).innerText = ""

                let dontContinue = false

                if (this.promptText === "") {
                    this.buttonClickColor = "#f30"
                    this.tweetNotification(getNegativeNotification('You didn\'t type anything in the prompt area!'))
                    return
                }

                this.tweetNotification(getPositiveNotification('Generating tweet, please wait!'))

                this.responses.map((res) => {
                    if (this.promptText === res.prompt)
                        dontContinue = true
                })

                if (dontContinue) {
                    this.buttonClickColor = "#f30"
                    this.tweetNotification(getNegativeNotification('You already have this prompt, please regenerate it!'))
                    return
                }

                this.buttonClickColor = "#0af"

                this.responses.push({prompt: this.promptText, options: defaultOptions, response: "Loading..."})

                let { data } = await openAIFetch(this.promptText, this.tweetOptions)
                let builtData = {
                    prompt: ((data.value as any).prompt).toString(),
                    options: ((data.value as any).options) as Options,
                    response: ((data.value as any).response).toString(),
                }
                let definedData = {
                    prompt: builtData.prompt !== undefined ? builtData.prompt : "",
                    options: builtData.options !== undefined ? builtData.options : defaultOptions,
                    response: builtData.response !== undefined ? builtData.response : "",
                }

                console.log(JSON.stringify(definedData))

                if (definedData.prompt === "Limit") {
                    this.responses.splice(this.responses.length - 1, 1)
                    this.tweetNotification(getNegativeNotification(definedData.response))
                } else {
                    this.responses[this.responses.length - 1] = definedData
                }
                
                this.promptText = "";
                this.tweetNotification(getPositiveNotification('Tweet generated!'))
            },
            deleteTweet(res: any) {
                this.responses.map((response, index) => {
                    if (res.prompt === response.prompt) {
                        this.responses.splice(index, 1)
                        this.updateLocalStorage()
                    }
                })
            },
            regenerateTweet(data: any) {
                this.responses.map((response, index) => {
                    if (data.prompt === "Limit") {
                        this.responses.splice(this.responses.length - 1, 1)
                        this.tweetNotification(getNegativeNotification(data.response))
                    } else {
                        this.responses[this.responses.length - 1] = data
                    }

                    if (data.prompt === response.prompt) {
                        this.responses[index] = data
                        this.updateLocalStorage()

                        console.log(JSON.stringify(data))
                    }
                })
            },
            tweetRegenStart(prompt: string) {
                this.responses.map((response, index) => {
                    if (prompt === response.prompt) {
                        this.responses[index] = {prompt: prompt, options: defaultOptions, response: "Loading..."}
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
                        this.updateLocalStorage()
                    }
                })
            },
            onNotificationClose(listPosition: number) {
                this.notificationList.splice(listPosition, 1)

            },
            tweetNotification(notification: any) {
                this.notificationList.push(notification)
            },
        },
    }
</script>

<style lang="scss">
    @keyframes fadein {
        from {
            opacity: 0%;
        }
        to {
            opacity: 100%;
        }
    }

    @keyframes fadeout {
        from {
            opacity: 100%;
        }
        to {
            opacity: 0%;
        }
    }
</style>

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

    .notifications {
        position: fixed;
        left: calc(50% - (256px / 2));
        transition: height 250ms ease-in-out;
        top: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 99;

        .notification {
            pointer-events: auto;
        }
    }

    .tweets {
        padding-bottom: v-bind('responses.length < 2 ? "0px" : "24px"');
        transition: padding 500ms ease-in-out;
    }
</style>
