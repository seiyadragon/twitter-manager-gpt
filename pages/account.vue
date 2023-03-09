<template>
    <div>
        <Box :title="loggedIn ? 'Welcome' : 'Sign in!'">
            <div v-if="loggedIn">
                <p>Balance: ${{ userbalance.toFixed(2) }} // {{ (userbalance / 0.05).toFixed(0) }} requests</p>
                <Button button-focus-color="#f30" @buttonClick="signOut">Sign out!</Button>
            </div>
            <div v-else>
                <Button button-focus-color="#0af" @buttonClick="signIn">Sign in!</Button>
            </div>
        </Box>
        <Filler :tweets="0" />
    </div>
</template>

<script lang="ts">
    export default {
        data() {
            return {
                user: null as any,
                loggedIn: false,
                userbalance: 0,
            }
        },
        async mounted() {
            let user = useSupabaseUser()
            let client = useSupabaseClient()

            if (user.value !== null) {
                this.user = user
                this.loggedIn = true

                let {data, error} = await client
                .from('ArtelligenceUserData')
                .select('*')
                .eq('userid', user.value.id)

                if (data !== null)
                    this.userbalance = (data[0] as any).userbalance
            }
        },
        methods: {
            async signOut() {
                let client = useSupabaseAuthClient()
                let router = useRouter()

                let error1 = await client.auth.signOut()
                let error2 = await router.push('/')
            },
            async signIn() {
                let router = useRouter()

                let error = await router.push("/signup")
            },
        },
    }
</script>