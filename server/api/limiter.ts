import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    let passed = false

    let limitKey = process.env.LMTKEY
    let {key, get, reset} = getQuery(event)

    if (limitKey !== key && get !== "true" && reset !== "true")
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
        if (get === "true") {
          console.log(arl[0].data.lastReqTime)

          return {
            requests: arl[0].data.requests,
            lastReqTime: arl[0].data.lastReqTime,
          }
        }
        
        if (arl[0].data.requests > 0) {
          arl[0].data.requests--
          passed = true
        }
        
        if (new Date().getTime() - arl[0].data.lastReqTime >= 86400000 || (reset === "true" && new Date().getTime() - arl[0].data.lastReqTime >= 86400000 / 2)) {
          arl[0].data.requests = 25
          arl[0].data.lastReqTime = new Date().getTime()
        }

        await supabase
        .from('ArtelligenceRateLimit')
        .update({data: {requests: arl[0].data.requests, lastReqTime: arl[0].data.lastReqTime}})
        .eq('id', 1)

        if (reset === 'true')
          return {
            requests: arl[0].data.requests,
            lastReqTime: arl[0].data.lastReqTime,
          }

        console.log(`Elapsed since last reset: ${(((new Date().getTime() - arl[0].data.lastReqTime) / 1000) / 60) / 60} hours. Requests left: ${arl[0].data.requests} requests!`)
    }

    return {
        passed: passed
    }
})