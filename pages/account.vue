<template>
    <div>
        <Box title="Welcome">
            <Button button-focus-color="#f30" @buttonClick="signOut">Sign out!</Button>
        </Box>
        <Filler :tweets="0" />
    </div>
</template>

<script lang="ts">
    export default {
        methods: {
            async signOut() {
                let client = useSupabaseAuthClient()
                let router = useRouter()

                let error1 = await client.auth.signOut()
                let error2 = await router.push('/')
            },
        },
    }
</script>