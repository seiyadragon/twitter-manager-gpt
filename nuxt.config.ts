// https://nuxt.com/docs/api/configuration/nuxt-config
export default {
    modules: ['nuxt-icon'],
    buildModules: ['@nuxt/typescript-build'],
    app: {
        head: {
            charset: 'utf-16',
            viewport: 'width=device-width, initial-scale=1',
            title: "Artelligence: Power your creations with AI",
            meta: [
                {
                    name: 'description', 
                    content: `
                        Artelligence is a site dedicated to bringing the power of AI right to the user's fingertips.
                        Utilize the power of OpenAI Davinchi model to generate amazing Tweets and Threads for your twitter.
                        More AI powered features incoming soon!
                    `
                }
            ]
        }
    }
}
