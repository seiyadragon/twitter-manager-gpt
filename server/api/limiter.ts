import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    let passed = false

    let limitKey = process.env.LMTKEY
    let {key} = getQuery(event)

    if (limitKey !== key)
      return {
        passed: passed
      }

    const supabase = createClient(process.env.SBURL !== undefined ? process.env.SBURL : "", 
                                  process.env.SBKEY !== undefined ? process.env.SBKEY : "")

    let { data: arl, error } = await supabase
    .from('ArtelligenceRateLimit')
    .select('*')
    .eq('id', 1)

    if (arl !== null) {
        if (arl[0].data.requests > 0) {
          arl[0].data.requests--
          passed = true
        }
        
        if (new Date().getTime() - arl[0].data.lastReqTime >= 86400000) {
          arl[0].data.requests = 500
          arl[0].data.lastReqTime = new Date().getTime()
        }

        await supabase
        .from('ArtelligenceRateLimit')
        .update({data: {requests: arl[0].data.requests, lastReqTime: arl[0].data.lastReqTime}})
        .eq('id', 1)

        console.log(`Elapsed since last reset: ${(((new Date().getTime() - arl[0].data.lastReqTime) / 1000) / 60) / 60} hours. Requests left: ${arl[0].data.requests} requests!`)
    }

    return {
        passed: passed
    }
})