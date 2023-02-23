<template>
    <main>
        <Header />
        <PaddingX>
            <slot />
        </PaddingX>
        <Footer />
    </main>
</template>

<script lang="ts">
    export default {
        methods: {
        },
        data() {
            return {
                
            }
        },
    }
</script>

<style lang="scss">
    @import url('https://fonts.googleapis.com/css?family=Zeyada');
    @import url('https://fonts.googleapis.com/css?family=Ubuntu');

    @keyframes flicker {
        0%, 18%, 22%, 25%, 53%, 57%, 100% {
          text-shadow:
            0 0 4px #fff,
            0 0 11px #fff,
            0 0 19px #fff,
            0 0 40px #0af,
            0 0 80px #0af,
            0 0 90px #0af,
            0 0 100px #0af,
            0 0 150px #0af;
        }
        20%, 24%, 55% {       
          text-shadow: none;
        }
    }

    body {
        margin: 0;
        font-family: 'Ubuntu';
        overflow-x: hidden;
    }

    ::-webkit-scrollbar {
        width: 3px;
    }

    ::-webkit-scrollbar-track {
      background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background-color:  rgb(0, 0, 0);
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background-color: rgb(0, 0, 0);
    }

    main {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

</style>