<template>
    <section>
        <PaddingX class="header">
            <a href="/" class="header-item neon-sign">Artelligence</a>
            <a href="/signup" v-if="user === null" class="header-link">Sign Up!</a>
            <a href="/account" v-else class="header-link">My account</a>
        </PaddingX>
    </section>
</template>

<script lang="ts">
    export default {
        setup() {
            const user = useSupabaseUser()

            return {
                user,
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header {
        background-color: black;
        height: 64px;
        display: flex;
        justify-content: space-between;
        color: white;
        font-size: 36px;
        
        .header-item, .header-link {
            margin-top: auto;
            margin-bottom: auto;
            font-size: 36px;
            text-decoration: none;
            color: white;
            font-family: 'Ubuntu';
        }

        .header-link {
            font-size: 16px;
        }
        
        .neon-sign {
            font-family: 'Zeyada';
            animation: flicker 2500ms infinite alternate;
            height: 32px;

            padding-bottom: 8px;
        }
    }
</style>