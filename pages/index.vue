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
        </Box>
        <Box v-for="res in responses" :title="res.prompt">
            <p>{{ res.response }}</p>
        </Box>
    </section>
</template>

<script lang="ts">
    export default {
        methods: {
            onPromptInput(event: any) {
                this.promptText = event.target.innerText
            },
            async onSubmitClick() {
                let { data } = await useFetch(`/api/openai?prompt=${this.promptText}&hashtags=${this.hashtags}&thread=${this.thread}&emojis=${this.emojis}`)
                let builtData = {
                    prompt: (data.value?.prompt)?.toString(),
                    response: (data.value?.response)?.toString(),
                }
                let definedData = {
                    prompt: builtData.prompt !== undefined ? builtData.prompt : "",
                    response: builtData.response !== undefined ? builtData.response : "",
                }
                
                this.responses.push(definedData)

                this.promptText = "";
                (this.$refs.textRef as HTMLDivElement).innerText = ""
            }
        },
        data() {
            return {
                promptText: "",
                responses: [] as Array<{prompt: string, response: string}>,
                hashtags: false,
                thread: false,
                emojis: false,
            }
        },
    }
</script>
