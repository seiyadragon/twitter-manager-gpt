<template>
    <Box v-if="!isLoggedIn" title="Login!">
        <p>Type the admin password here:</p>
        <div :contenteditable="true" class="prompt" @input="onInput" />
        <Button @buttonClick="onLoginClick">
            Login
        </Button>
    </Box>
    <Box v-if="isLoggedIn" title="Admin">
        <p>Requests made: {{ requests + " / 25" }} </p>
        <p>Time left: {{ timeLeft + " hours" }} </p>
        <Button @buttonClick="onReset">Reset Limit!</Button>
    </Box>
    <Button class="back-to-home">
        <NuxtLink href="/">Back to home!</NuxtLink>
    </Button>
</template>

<script lang="ts">
    export default {
        data() {
            return {
                isLoggedIn: false,
                password: "",
                requests: 0,
                timeLeft: 0,
            }
        },
        methods: {
            onInput(event: any) {
                this.password = event.target.innerText
            },
            async onLoginClick() {
                let {data} = await useFetch(`/api/adminLogin?password=${escape(this.password)}`)

                console.log(JSON.stringify(data.value))

                this.isLoggedIn = data.value?.canLogin as boolean

                await this.getData()
            },
            async getData() {
                let {data} = await useFetch(`/api/limiter?get=true`)

                this.requests = 25 - data.value?.requests
                this.timeLeft = 24 - ((new Date().getTime() - data.value?.lastReqTime) / 1000 / 60 / 60)

                setTimeout(async () => await this.getData(), 300000)
            },
            async onReset() {
                let {data} = await useFetch(`/api/limiter?reset=true`)

                this.requests = 25 - data.value?.requests
                this.timeLeft = 24 - ((new Date().getTime() - data.value?.lastReqTime) / 1000 / 60 / 60)
            },
        },
    }
</script>

<style class="scss" scoped>
    .back-to-home {
        margin-bottom: 24px;
    }
</style>