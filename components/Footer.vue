<template>
    <div class="footer">
        <PaddingX class="footer-padding">
            <div class="footer-content">
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
                    <div class="links">
                        <a href="https://twitter.com/arlenmolina101">
                            <Icon name="ion:logo-twitter" />
                            twitter
                        </a>
                        <a href="https://www.instagram.com/arlenmolina101/">
                            <Icon name="ion:logo-instagram" />
                            instagram
                        </a>
                        <a href="https://www.linkedin.com/in/arlen-molina-423159183/">
                            <Icon name="ion:logo-linkedin" />
                            linkedin
                        </a>
                        <a href="https://github.com/seiyadragon">
                            <Icon name="ion:logo-github" />
                            github
                        </a>
                        <a href="https://codepen.io/seiyadragon">
                            <Icon name="ion:logo-codepen" />
                            codepen
                        </a>
                        <a href="https://www.arlenmolina.codes/">
                            <Icon name="ion:laptop" />
                            portfolio
                        </a>
                    </div>
                </section>
            </div>
        </PaddingX>
    </div>
</template>

<style lang="scss">
    .footer {
        margin-top: 28px;
        
        .footer-padding {
            padding-top: 1px;
            padding-bottom: 1px;
            animation: 1000ms ease-in-out slidein;
            
            .footer-content {
                display: flex;
                justify-content: space-between;
                border-top: 1px solid black;
            }

            h1, .links {
                text-align: center;
            }

            .links {
                display: flex;
                flex-direction: column;

                a {
                    text-decoration: none;
                    margin-top: 3px;
                    margin-bottom: 3px;
                    display: inline-block;
                    position: relative;
                    max-width: 20%;
                    left: 40%;

                    &::after {
                        content: '';
                        position: absolute;
                        width: 100%;
                        transform: scaleX(0);
                        height: 1px;
                        bottom: 0;
                        left: 0;
                        background-color: black;
                        transform-origin: bottom right;
                        transition: transform 250ms ease-in-out;
                    }

                    &:hover::after {
                        transform: scale(1);
                        transform-origin: bottom left;
                    }
                }
            }

            .footer-section {
                width: 50%;
            }
        }
    }
</style>