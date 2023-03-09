import { createClient } from '@supabase/supabase-js'

const DAYLY_LIMIT = 100
const COST_PER_TWEET = 0.05

export default defineEventHandler(async (event) => {
    let passed = false
    let free = false

    let limitKey = process.env.LMTKEY
    let {key, userid} = getQuery(event)

    if (limitKey !== key)
      return {
        passed: passed,
        free: free,
      }

    const supabase = createClient(process.env.SBURL !== undefined ? process.env.SBURL : "", 
                                  process.env.SBKEY !== undefined ? process.env.SBKEY : "")

    let { data: arl, error: err1 } = await supabase
    .from('ArtelligenceRateLimit')
    .select('*')
    .eq('id', 1)

    let {data: userData, error: err2} = await supabase
    .from('ArtelligenceUserData')
    .select('*')
    .eq('userid', userid)

    console.log(err2)
    
    let notEnoughtBalance = false

    if (userData !== null && userData.length != 0) {
      if (userData[0].userbalance - COST_PER_TWEET >= 0.0) {
        userData[0].userbalance -= COST_PER_TWEET

        await supabase
        .from('ArtelligenceUserData')
        .update({
          userid: userid,
          userbalance: userData[0].userbalance,
        })
        .eq('userid', userid)

        passed = true
      } else notEnoughtBalance = true
    }

    if (arl !== null) {
        if ((arl[0].data.requests > 0 && (userid === '' || userid === null)) || (arl[0].data.requests > 0 && notEnoughtBalance)) {
          arl[0].data.requests--
          passed = true
          free = true
        }
        
        if (new Date().getTime() - arl[0].data.lastReqTime >= 86400000) {
          arl[0].data.requests = DAYLY_LIMIT
          arl[0].data.lastReqTime = new Date().getTime()
        }

        await supabase
        .from('ArtelligenceRateLimit')
        .update({data: {requests: arl[0].data.requests, lastReqTime: arl[0].data.lastReqTime}})
        .eq('id', 1)

        console.log(`Elapsed since last reset: ${(((new Date().getTime() - arl[0].data.lastReqTime) / 1000) / 60) / 60} hours. Requests left: ${arl[0].data.requests} requests!`)
    }

    return {
        passed: passed,
        free: free,
    }
})