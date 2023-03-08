<template>
    <div :class="plugExpanded ? 'filler-expanded' : 'filler'">
        <div :class="plugLoaded ? 'plug-wrapper-loaded' : 'plug-wrapper'">
            <iframe 
                v-show="plugLoaded" 
                ref="iframe" 
                class="shameless-plug" 
                src="https://arlenmolina.codes" 
                :scrolling="plugExpanded ? 'yes' : 'no'" 
                @load="onPlugLoad"
            />
        </div>
        <Button @click="expandPlug" v-if="responses.length < 2" class="learn-more">Learn more!</Button>
    </div>
</template>

<script lang="ts">
    export default {
        props: {
            tweets: Number,
        },
        methods: {
            expandPlug() {
                this.plugExpanded = !this.plugExpanded
            },
            onPlugLoad(event: any) {
                this.plugLoaded = true;
            },
        },
        data() {
            return {
                plugExpanded: false,
                plugLoaded: false,
                responses: {
                    length: 0,
                }
            }
        },
        mounted() {
            if (this.tweets !== undefined)
                this.responses.length = this.tweets;

            (this.$refs.iframe as HTMLIFrameElement).onload = () => {
                    this.plugLoaded = true
            }

            setTimeout(() => {
                if (this.plugLoaded != true)
                    this.plugLoaded = true
            }, 3000)
        }
    }
</script>

<style lang="scss" scoped>
    .filler, .filler-expanded {
        transition: height 500ms ease-in-out, padding 500ms ease-in-out, display 500ms ease-in-out;
        height: v-bind('((2 - (responses.length < 2 ? responses.length : 2)) * 256).toString() + "px"');
        border-left: dashed 1px gray;
        border-right: dashed 1px gray;
        margin-top: 4px;
        margin-bottom: 4px;
        padding-top: v-bind('responses.length < 2 ? "8px" : "0px"');
        padding-bottom: v-bind('responses.length < 2 ? "8px" : "0px"');
        display: v-bind('responses.length < 2 ? "block" : "none"');
    }

    .filler-expanded {
        height: v-bind('((4 - responses.length) * 256).toString() + "px"');

        .shameless-plug {
            height: calc(v-bind('((4 - responses.length) * 256).toString() + "px"') - 70px);
            transition: height 500ms ease-in-out;
        }

        .plug-wrapper, .plug-wrapper-loaded {
            height: calc(v-bind('((4 - responses.length) * 256).toString() + "px"') - 70px);
            transition: height 500ms ease-in-out;
            background-image: none;
        }
    }

    .shameless-plug {
        width: 100%;
        height: calc(v-bind('((2 - responses.length) * 256).toString() + "px"') - 70px);
        border: none;
        transition: height 500ms ease-in-out;
        animation: fadein 500ms ease-in-out;
    }

    .plug-wrapper, .plug-wrapper-loaded {
        background-image: url("/fidget-spinner.gif");
        width: 100%;
        height: calc(v-bind('((2 - responses.length) * 256).toString() + "px"') - 70px);
        transition: height 500ms ease-in-out;
        animation: scalein 500ms ease-in-out;
    }

    .learn-more {
        margin-left: 8px;
        margin-right: 8px;
    }
</style>