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
            topic : 'ride-events',
            fromBeginning : true,
        });

        await consumer.run({
            eachMessage : async( {message} ) => {
                const event = JSON.parse(message.value.toString());
                console.log(`🚖 ${event.eventType} | ${event.rideId}`);

                if(event.eventType === 'RIDE_STARTED'){
                    await redis.incr('active_rides');
                }

                if(event.eventType === 'RIDE_CANCELLED' || event.eventType === 'RIDE_COMPELETED'){
                    await redis.decr('active_rides');
                }

                if(event.eventType === 'RIDE_COMPLETED'){
                    await redis.incr("completed_rides");
                }

                if(event.eventType === 'RIDE_CANCELLED'){
                    await redis.incr('cancelled_rides');
                }

                if(event.eventType === 'RIDE_REQUESTED'){
                    await redis.incr(`city:${event.city}:requests`);
                }

                if(event.eventType === 'RIDE_REQUESTED'){
                    await redis.zincrby(
                        'top_areas',
                        1,
                        `${event.city} : ${event.area}`
                    );
                }

                //surge detection 

                const areakey = `area:${event.city}:${event.area}:requests`;

                await redis.incr(areakey);
                await redis.expire(areakey,60);

                const areaRequests = await redis.get(areakey);

                if(areaRequests > 20){
                    console.log(
                        `🔥 SURGE DETECTED in ${event.area}`
                    );

                    await redis.set(
                        `surge:${event.city}:${event.area}`,
                        'true',
                        'EX',
                        60
                    );
                }


                //postgreSQL

                try {
                    await pgClient.query(
                        `INSERT INTO events(
                            event_id, 
                            ride_id,
                            event_type,
                            rider_id,
                            driver_id,
                            city,
                            area,
                            fare,
                            distance_km,
                            duration_minutes,
                            timestamp
                        )
                        VALUES
                        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
                        `,
                        [
                            event.eventId,
                            event.rideId,
                            event.eventType,
                            event.riderId,
                            event.driverId,
                            event.city,
                            event.area,
                            event.fare,
                            parseFloat(event.distanceKm),
                            event.durationMinutes || null,
                            event.timestamp,
                        ]
                    );

                    console.log("stored in postgreSQL")
                }catch(err){
                    console.error('❌ PostgreSQL Insert Error:', err);
                }
            },  
        })
    } catch(err){
        console.log("Error in consumer : " , err);
    } 
}

run();