const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId : 'event_consumer',
    brokers : ['localhost:9092']
})

const consumer = kafka.consumer({groupId : 'analytics-group'});

const run = async () => {
    await consumer.connect();

    try{
        await consumer.subscribe({
            topic : 'user-events',
            fromBeginning : true,
        });

        await consumer.run({
            eachMessage : async( {message} ) => {
                const event = JSON.parse(message.value.toString());
                console.log("Received event : " , event);
            },  
        })
    } catch(err){
        console.log("Error in consumer : " , err);
    } 
}

run();