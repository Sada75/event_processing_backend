const express = require('express');
const Redis = require('ioredis');

const app = express();
const port = 3000;

const redis = new Redis({
    host : '127.0.0.1',
    port : 6379,
})

// 🔹 1. Total Events
app.get('/metrics/total-events' , async (req , res) => {
    const total = await redis.get('total_events');
    res.json({total : total || 0})
})

// 🔹 2. Events per second (last 10 seconds)


app.get('/metrics/events-per-second', async (req ,res) => {
    const now = Math.floor(Date.now() / 1000);

    let data = [];

    for(let i = 0;i<10;i++){
        const ts = now - i;
        const count = await redis.get(`events:${ts}`);

        data.push({
            second : ts,
            count : parseInt(count) || 0,
        })

    }
    res.json(data.reverse());
})

// active users

app.get('/metrics/active-users' , async ( req ,res ) => {
    const users = await redis.smembers('active_users')
    res.json({
        count : users.length , 
        users
    })
})


// top users 

app.get('/metrics/top-users' , async (req , res) => {
    const users = await redis.zrevrange('top_users', 0 , 4 , 'WITHSCORES');

    let result = [];
    for(let i=0;i<users.length;i = i + 2){
        result.push({
            user : users[i],
            count : parseInt(users[i+1]),
        })
    }

    res.json(result);
})

app.listen(port , () => {
    console.log(`🚀 API running on http://localhost:${port}`);
})