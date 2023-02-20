import {createClient} from '@vercel/edge-config'

export default defineEventHandler(async (event) => {
    const client = createClient(process.env.EDGE_CONFIG)
    const config = await client.getAll()

    if (config.lastTime == 0 || config.lastTime - new Date().getTime() >= 3600000) {
        config.lastTime = new Date().getTime()
        config.requests = 0
    }

    config.requests++

    try {
        const updateEdgeConfig = await fetch(process.env.EDGE_CONFIG !== undefined ? process.env.EDGE_CONFIG : "", {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: [
                {
                  operation: 'update',
                  key: 'requests',
                  value: config.requests
                },
                {
                  operation: 'update',
                  key: 'lastTime',
                  value: config.lastTime
                }
              ]
            })
        })
        const result = updateEdgeConfig
        console.log(updateEdgeConfig);
    } catch (error) {
        console.log(error);
    }

    return {
        message: 'yuh'
    }
})