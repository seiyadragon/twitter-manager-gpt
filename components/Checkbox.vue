<template>
    <div class="checkbox-container">
        <div :class="checkboxClass" @click="onClick">
            <input ref="inputRef" type="checkbox" class="invis" v-model="checkboxChecked">
        </div>
        <p>{{ label }}</p>
    </div>
</template>

<script lang="ts">
    export default {
        props: {
            label: String,
        },
        methods: {
            onClick() {
                let input = (this.$refs.inputRef as HTMLInputElement)
                input.click()

                if (this.checkboxChecked)
                    this.checkboxClass = "checkbox-checked"
                else
                    this.checkboxClass = "checkbox"

                this.$emit('onTicked', this.checkboxChecked)
            }
        },
        data() {
            return {
                checkboxClass: "checkbox",
                checkboxChecked: false,
            }
        },
    }
</script>

<style lang="scss">
    .checkbox-container {
        display: flex;
        
        p {
            margin-left: 8px;
            padding-top: 4px;
            padding-bottom: 4px;
        }
    }

    .checkbox, .checkbox-checked {
        border: 1px solid black;
        width: 24px;
        height: 24px;
        transition: background-color 250ms ease-in-out, 
                    transform 250ms ease-in-out, 
                    box-shadow 250ms ease-in-out,
                    color 250ms ease-in-out;
        border-radius: 6px;
    }

    .checkbox-checked {
        background-color: #0af;
        box-shadow: 6px 6px black;
        transform: translate(-3px, -3px);
    }

    .invis {
        display: none;
    }
</style>