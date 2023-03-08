<template>
    <section :class="closing === true ? 'prompt-section-closing' : 'prompt-section'">
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
            closing: Boolean,
        }
    }
</script>

<style lang="scss">
    @keyframes scalein {
        from {
            transform: scale(0.01, 0.01);
        }

        to {
            transform: scale(1, 1);
        }
    }

    @keyframes scaleout {
        from {
            transform: scale(1, 1);
        }

        to {
            transform: scale(0.01, 0.01);
        }
    }
</style>

<style lang="scss" scoped>
    .prompt-section, .prompt-section-closing {
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

            &:deep(h1) {
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

            &:deep(p) {
                margin-top: 0;
            }

            &:deep(.prompt) {
                border: none;

                width: 100%;
                border-bottom: solid black 1px;
                margin-top: 12px;
                font-size: 16px;
                font-family: 'Ubuntu';
    
                &:focus {
                    outline: none;
                }
            }
        }
    }

    .prompt-section {
        animation: 250ms ease-in-out scalein;
    }

    .prompt-section-closing {
        animation: 250ms ease-in-out scaleout;
    }
</style>