const { Kafka } = require('kafkajs');
const Redis = require('ioredis');
const { Client } = require('pg');

const kafka = new Kafka({
    clientId : 'event_consumer',
    brokers : ['localhost:9092']
})

const redis = new Redis({
    host : '127.0.0.1',
    port : 6379,
})

const pgClient = new Client({
    user : "admin",
    host : "127.0.0.1",
    database : "events_db",
    password : 'password',
    port : 5432,
})


const connectPostgres = async () => {
    let retries = 10;

    while(retries){
        try{
            await pgClient.connect();
            console.log("Connected to Postgres");
            return;
        }catch(err){
            console.log("Failed to connect to Postgres, retrying in 5 seconds...");
            retries--;
            await new Promise(res => setTimeout(res , 3000));
        }

    }
    
    throw new Error("Failed to connect to Postgres after multiple attempts");


}

const consumer = kafka.consumer({groupId : 'analytics-group'});

const run = async () => {
    await consumer.connect();
    await connectPostgres();


    try{
        await consumer.subscribe({
            topic : 'user-events',
            fromBeginning : true,
        });

        await consumer.run({
            eachMessage : async( {message} ) => {
                const event = JSON.parse(message.value.toString());
                console.log("Received event : " , event);

                // 🔹 Events per second (bucket by second)
                const currentSecond = Math.floor(Date.now() / 1000);
                await redis.incr(`events:${currentSecond}`) 


                // expire after 60 seconds to keep only recent data for real-time analytics
                await redis.expire(`events:${currentSecond}` , 60);


                // track active users
                await redis.sadd('active_users' , event.userId);
                await redis.expire('active_users' , 60);

                // track top users
                await redis.zincrby('top_users', 1,event.userId);

                // Store in pg

                await pgClient.query(
                    `INSERT INTO events(event_id , user_id , type , timestamp) VALUES($1 , $2 , $3 , $4)`,
                    [event.eventId , event.userId , event.type , event.timestamp]
                )

                // store in redis

                await redis.incr('total_events');
                await redis.incr(`user:${event.userId}:count`)
            },  
        })
    } catch(err){
        console.log("Error in consumer : " , err);
    } 
}

run();