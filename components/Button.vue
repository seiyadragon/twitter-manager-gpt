<template>
    <div class="button-container">
        <button class="button">
            <strong>
                <slot />
            </strong>
        </button>
    </div>
</template>

<style lang="scss">
    .button-container {
        padding-top: 24px;

        .button {
            background-color: black;
            border: solid 1px black;
            color: white;
            font-size: 16px;
            font-family: 'Ubuntu';
            padding-top: 12px;
            padding-bottom: 12px;
            width: 100%;
            transition: background-color 250ms ease-in-out, 
                        transform 250ms ease-in-out, 
                        box-shadow 250ms ease-in-out,
                        color 250ms ease-in-out;
            border-radius: 6px;

            &:hover, &:focus {
                background-color: #0af;
                box-shadow: 6px 6px black;
                transform: translate(-3px, -3px);
                color: black;
            }
        }
    }
</style>