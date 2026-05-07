const express = require('express');
const Redis = require('ioredis');
const http = require('http');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server , {
    cors : {origin : "*"},
})

const cors = require('cors');

const port = 3000;

const redis = new Redis({
    host : '127.0.0.1',
    port : 6379,
})

app.use(cors());

//websocket connection 

io.on('connection' , (socket) => {
    console.log("Client connected");

    const interval = setInterval(async () => {
        const total = await redis.get('total_events');
        const activeUsers = await redis.smembers('active_users')

        const topUsersRaw = await redis.zrevrange('top_users', 0, 4 , 'WITHSCORES');

        let topUsers = [];

        for(let i = 0 ;i < topUsersRaw.length ; i += 2){
            topUsers.push({
                user : topUsersRaw[i],
                score : parseInt(topUsersRaw[i+1])
            })
        }

        socket.emit('metrics', {
            total : parseInt(total || 0),
            activeUsers : activeUsers.length,
            topUsers,
            timestamp: Date.now(),

        })
    },1000)

    socket.on('disconnect' , () => {
        clearInterval(interval);
        console.log('Client disconnected');
    })
})

app.get('/metrics/active-rides' , async (req, res) => {
    const active = await redis.get('active_rides');

    res.json({
        activeRides : parseInt(active || 0)
    })
})


app.get('/metrics/completed-rides' , async (req,res) => {
    const completed = await redis.get('completed_rides')    ;

    res.json({
        completedRides : parseInt(completed || 0)
    })
})

app.get("/metrics/cancelled-rides" , async (req, res) => {
    const cancelled = await redis.get('cancelled_rides');

    res.json({
        cancelledRides : parseInt(cancelled || 0)
    })
})

app.get("/metrics/top-areas" , async (req, res) => {
    const areas = await redis.zrevrange(
        'top_areas',
        0,
        9,
        'WITHSCORES'
    );

    let result = [];
    
    for(let i=0;i<areas.length;i=i+2){
        result.push({
            area : areas[i],
            rides : parseInt(areas[i+1])
        })
    }

    res.json(result);
})


app.get("/metrics/surge-areas" , async (req , res) => {
    const keys = await redis.keys('surge:*');

    const surgeAreas = keys.map((key) => {
        const parts = key.split(':');

        return {
            city : parts[1],
            area : parts[2]
        }
    })

    res.json(surgeAreas);
})

app.get("/metrics/city-demand" , async (req , res) => {
    const cities = ['Bangalore' , 'Mumbai'];

    let result = [];

    for(let i = 0;i<cities.length;i++){
        const city = cities[i];

        const count = await redis.get(`city:${city}:requests`);

        result.push({
            city : city , 
            requests : parseInt(count || 0)
        })
    }

    res.json(result);
})

server.listen(port , () => {
    console.log(`🚀 API running on http://localhost:${port}`);
})