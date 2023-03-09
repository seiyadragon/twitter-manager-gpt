import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    let {userid} = getQuery(event)
    let passed = false

    if (userid === '' || userid === null) return {
        passed: passed,
    }

    const supabase = createClient(process.env.SBURL !== undefined ? process.env.SBURL : "", 
                                  process.env.SBKEY !== undefined ? process.env.SBKEY : "")

    let {data, error} = await supabase
    .from('ArtelligenceUserData')
    .select('*')
    .eq('userid', userid)

    if (data === null || data.length == 0) {
        await supabase
        .from('ArtelligenceUserData')
        .insert({
            userid: userid, 
            userbalance: 5.00
        })

        passed = true
    } else return {
        passed: passed
    }

    return {
        passed: passed,
    }
})