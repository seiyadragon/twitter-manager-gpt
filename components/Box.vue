<template>
    <section class="prompt-section">
        <div class="prompt-title">
            <h1>{{ title }}</h1>
        </div>
        <div class="prompt-body">
            <slot />
        </div>
    </section>
</template>

<script lang="ts">
    export default {
        props: {
            title: String,
        }
    }
</script>

<style lang="scss">
    .prompt-section {
        border: solid 1px gray;
        margin-top: 24px;
        padding-bottom: 24px;
        padding-top: 0;
        border-radius: 6px;
        
        .prompt-title {
            background-color: black;
            color: white;
            padding-left: 8px;
            padding-right: 8px;
            margin-bottom: 0;
            border-top-right-radius: 4px;
            border-top-left-radius: 4px;

            h1 {
                font-size: 24px;
                margin-top: 0;
                padding-top: 8px;
                padding-bottom: 8px;
            }
        }

        .prompt-body {
            margin-top: 0;
            padding-left: 8px;
            padding-right: 8px;

            p {
                margin-top: 0;
            }

            .prompt {
                width: 100%;
                border-bottom: solid black 1px;
                margin-top: 12px;
    
                &:focus {
                    outline: none;
                }
            }
        }

    }
</style>