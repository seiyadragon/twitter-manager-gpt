import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const supabase = createClient(process.env.SBURL !== undefined ? process.env.SBURL : "", 
                                  process.env.SBKEY !== undefined ? process.env.SBKEY : "")

    let { data: arl, error } = await supabase
    .from('ArtelligenceRateLimit')
    .select('*')
    .eq('id', 1)

    let passed = false

    if (arl !== null) {
        if (arl[0].data.requests > 0) {
          arl[0].data.requests--
          passed = true
        }
        
        if (new Date().getTime() - arl[0].data.lastReqTime >= 86400000) {
          arl[0].data.requests = 500
          arl[0].data.lastReqTime = new Date().getTime()
        }

        console.log(new Date().getTime() - arl[0].data.lastReqTime)

        await supabase
        .from('ArtelligenceRateLimit')
        .update({data: {requests: arl[0].data.requests, lastReqTime: arl[0].data.lastReqTime}})
        .eq('id', 1)
    }

    return {
        passed: passed
    }
})