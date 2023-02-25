<template>
    <div :class="closing == true ? 'notification-closing' : 'notification'">
        <div class="notification-body">
            <div class="slot-container">
                <slot />
            </div>
            <div class="button-container">
                <Button ref="closeButton" :button-focus-color="notificationColor" @click="onClose">
                    <Icon name="ion:close" />
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    export default {
        props: {
            notificationColor: String,
            listPosition: Number,
        },
        data() {
            return {
                closing: false,
            }
        },
        methods: {
            onClose() {
                this.closing = true

                setTimeout(() => {
                    this.$emit('closed', this.listPosition)
                    this.closing = false
                }, 250)
            },
            closeTimeout(timeout: number) {
                setTimeout(() => {
                    this.onClose()

                    if (this) {
                        this.closeTimeout(timeout / 2)
                    }
                }, timeout)
            },
        },
        mounted() {
            this.closeTimeout(5000)
        },
    }
</script>

<style lang="scss">
    @keyframes slideup {
        from {
            transform: translate(0, calc(-256px - v-bind("`${listPosition !== undefined ? 100 + listPosition * (100) : '100'}px`")));
        }

        to {
            transform:  translate(0, 0);
        }
    }

    @keyframes slidedown {
        from {
            transform:  translate(0, 0);
        }

        to {
            transform: translate(0, calc(-256px - v-bind("`${listPosition !== undefined ? 100 + listPosition * (100) : '100'}px`")));
        }
    }
</style>

<style lang="scss" scoped>
    .notification, .notification-closing {
        position: sticky;
        width: 256px;
        max-height: 256px;
        background-color: v-bind("notificationColor");
        top: v-bind("`${listPosition !== undefined ? 100 + listPosition * (100) : '100'}px`");
        margin-left: auto;
        margin-right: auto;
        border-radius: 6px;
        border: solid 1px black;
        padding-left: 8px;
        padding-right: 8px;
        z-index: 99;

        .notification-body {
            display: flex;

            .slot-container {
                width: 90%;
                padding-right: 4px;
            }

            .button-container {
                display: flex;
                align-content: center;
                padding-top: 10px;
                padding-bottom: 8px;

                &:deep(button) {
                    width: 48px;
                    height: 48px
                }
            }
        }
    }

    .notification {
        animation: slidedown 250ms ease-in-out;
    }

    .notification-closing {
        animation: slideup 250ms ease-in-out;
    }
</style>