<template>
    <section>
        <PaddingX class="header">
            <h1 class="header-item neon-sign">TWITTER GPT</h1>
        </PaddingX>
    </section>
</template>

<style lang="scss" scoped>
    .header {
        background-color: black;
        height: 64px;
        display: flex;
        justify-content: space-between;
        color: white;
        font-size: 36px;
        font-family: 'Zeyada';
        
        .header-item {
            margin-top: auto;
            margin-bottom: auto;
            font-size: 36px;
        }
        
        .neon-sign {
            animation: flicker 2500ms infinite alternate;
            height: 32px;

            padding-bottom: 8px;
        }
    }
</style>