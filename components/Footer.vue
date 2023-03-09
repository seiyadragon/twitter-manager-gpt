<template>
    <div class="footer">
        <PaddingX class="footer-padding">
            <div class="footer-content">
                <section class="footer-section">
                    <h1>About</h1>
                    <p>{{ `
                        You can generate tweets using the power of AI! 
                        The free tier does not allow any customization options. And will be limited to 100
                        collective tweets per day. 
                        If you would like to have access to the options, make sure to register an
                        account for free and you will have access to 100 free tweets and threads. 
                    ` }}</p>
                    <p>{{ `
                        You can view more information about the account and pricing in the about page!
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
                        <NuxtLink href="/about">
                            <Icon name="ion:help" />
                            about
                        </NuxtLink>
                    </div>
                </section>
            </div>
        </PaddingX>
    </div>
</template>

<style lang="scss" scoped>
    @keyframes slidedown {
        from {
            transform: translate(0, 0);
        }

        to {
            transform: translate(0, 35vh);
        }
    }

    .footer {        
        .footer-padding {
            padding-top: 1px;
            padding-bottom: 1px;
            animation: slidedown 500ms ease-in-out;

            
            .footer-content {
                display: flex;
                justify-content: space-between;
                border-top: 1px solid black;
                border-left: 1px solid black;
                border-right: 1px solid black;
                padding-left: 8px;
                padding-right: 8px;
                border-top-right-radius: 6px;
                border-top-left-radius: 6px;
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
                        transition: transform 500ms ease-in-out;
                        animation: fadeout 500ms ease-in-out;
                    }

                    &:hover::after {
                        transform: scale(1);
                        transform-origin: bottom left;
                        animation: fadein 500ms ease-in-out;
                    }
                }
            }

            .footer-section {
                width: 50%;
            }
        }
    }
</style>