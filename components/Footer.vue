<template>
    <div class="footer">
        <PaddingX class="footer-padding">
            <section class="footer-section">
                <h1>About</h1>
                <p>{{ `
                    This is a project that came about from my own needs.
                    I wanted to make a solution for generating tweets far easier than what I had been using.
                    Later the idea started evolving into a more general purpose AI backed project.
                    The goals of the project is to bring many AI tools to many people for free.
                    However it does cost money to run this site and therefore there will be limits in place.
                    Payment plans will be implemented for anyone who wishes to have unlimited use.
                    My name is Arlen, I'm a 21 year old developer, on my last year of college. I'm also
                    starting to freelance. Check out my links and get in touch!
                ` }}</p>
            </section>
            <section class="footer-section">
                <h1>Links</h1>
            </section>
        </PaddingX>
    </div>
</template>

<style lang="scss">
    .footer {
        background-color: black;
        margin-top: 28px;
        
        .footer-padding {
            padding-top: 1px;
            padding-bottom: 1px;
            color: white;
            display: flex;
            justify-content: space-between;

            h1 {
                text-align: center;
            }

            .footer-section {
                width: 50%;
            }
        }
    }
</style>