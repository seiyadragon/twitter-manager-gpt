export default defineEventHandler(async (event) => {
    let {password} = getQuery(event)
    let correctPassword = process.env.ADMNPSSWD
    let isPasswordCorrect = false

    console.log("Typed: " + password)
    console.log("Correct: " + correctPassword)

    if (password === correctPassword?.toString()) {
        isPasswordCorrect = true
    }

    return {
        canLogin: isPasswordCorrect,
    }
})