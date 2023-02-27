<template>
    <div class="range-selector">
        <input type="range" class="length-selector" :min="min" :max="max" :step="step" v-model="value" @input="onInput">
        <p>Length: {{ 140 * (value) }} - {{ 280 * (value) }} characters or ~{{ value }} {{ value == 1 ? 'tweet' : 'tweets' }}</p>
    </div>
</template>

<script lang="ts">
    export default {
        props: {
            min: Number,
            max: Number,
            step: Number,
            initial: Number,
        },
        data() {
            return {
                value: 0,
            }
        },
        mounted() {
            this.value = this.initial !== undefined ? this.initial : 0
        },
        methods: {
            onInput() {
                this.$emit('valueChanged', JSON.stringify({start:140 * this.value, end:280 * this.value}))
            },
        },
    }
</script>

<style lang="scss" scoped>
    .range-selector {
        padding-top: 8px;
        padding-bottom: 8px;

        p {
            text-align: center;
            color: black;
        }
    }
    .length-selector {
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        cursor: pointer;
        width: 100%;
        padding-top: 16px;
        padding-bottom: 16px;

        &::-webkit-slider-runnable-track {
            background-color: black;
            height: 1px;
        }

        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            background-color: black;
            width: 32px;
            height: 32px;
            border-radius: 100%;
            margin-top: -16px;
            border: solid 1px black;
            transition: background-color 250ms ease-in-out, 
                        transform 250ms ease-in-out, 
                        box-shadow 250ms ease-in-out,
                        color 250ms ease-in-out;

            &:hover, &:focus {
                background-color: #0af;
                box-shadow: 6px 6px black;
                transform: translate(-3px, -3px);
                color: black;
            }
        }

        &::-moz-range-track {
            background-color: black;
            height: 1px;
        }

        &::-moz-range-thumb {
            background-color: black;
            width: 32px;
            height: 32px;
            border-radius: 100%;
            border: solid 1px black;
            transition: background-color 250ms ease-in-out, 
                        transform 250ms ease-in-out, 
                        box-shadow 250ms ease-in-out,
                        color 250ms ease-in-out;

            &:hover, &:focus {
                background-color: #0af;
                box-shadow: 6px 6px black;
                transform: translate(-3px, -3px);
                color: black;
            }
        }
    }
</style>