<template>
    <section>
        <Box :title="signUp ? 'Sign Up!' : 'Log in!'">
            <form>
                <p>Type your email here:</p>
                <input class="prompt" type="email" v-model="email" autocomplete="email">
                <p>Type your password here:</p>
                <input v-if="signUp" class="prompt" type="password" v-model="password" autocomplete="new-password">
                <input v-else class="prompt" type="password" v-model="password" autocomplete="current-password">
                <Button :button-focus-color="buttonHoverColor" @click="onSubmit">{{ signUp ? 'Sign Up' : 'Log in!' }}</Button>
                <Button :button-focus-color="buttonHoverColor" @click="alreadyHave">
                    {{ signUp ? 'Already have an account?' : 'Don\'t have an account yet?' }}
                </Button>
            </form>
        </Box>
    </section>
</template>

<script lang="ts">
    export default {
        data() {
            return {
                signUp: true,
                email: "",
                password: "",
                buttonHoverColor: "#0af"
            }
        },
        methods: {
            async onSubmit() {
                const client = useSupabaseAuthClient()
                const router = useRouter()

                if (this.signUp) {
                    const error = await client.auth.signUp({
                        email: this.email,
                        password: this.password
                    })

                    this.email = ""
                    this.password = ""
                    this.signUp = false

                    console.log(error)
                } else {
                    const error = await client.auth.signInWithPassword({
                        email: this.email,
                        password: this.password
                    })

                    await router.push("/")

                    console.log(error)
                }
            },
            alreadyHave() {
                this.signUp = !this.signUp
                this.email = ""
                this.password = ""
            },
        },
    }
</script>

<style lang="scss" scoped>
    .prompt {
        margin-bottom: 24px;
    }
</style>