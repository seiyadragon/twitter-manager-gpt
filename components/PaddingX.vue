<template>
    <div class="paddingX">
        <slot />
    </div>
</template>

<style lang="scss" scoped>
    .paddingX {
        padding-left: clamp(8px, 5%, 384px);
        padding-right: clamp(8px, 5%, 384px);
        padding-top: 0px;
        padding-bottom: 0px;

        @media (min-width: 720px) {
            padding-left: clamp(8px, 10%, 384px);
            padding-right: clamp(8px, 10%, 384px);
        }

        @media (min-width: 1080px) {
            padding-left: clamp(8px, 15%, 384px);
            padding-right: clamp(8px, 15%, 384px);
        }

        @media (min-width: 1440px) {
            padding-left: clamp(8px, 20%, 384px);
            padding-right: clamp(8px, 20%, 384px);
        }

        @media (min-width: 1800px) {
            padding-left: clamp(8px, 25%, 384px);
            padding-right: clamp(8px, 25%, 384px);
        }
    }
</style>