const {Kafka} = require('kafkajs');

const kafka = new Kafka({
    clientId : 'event-producer',
    brokers : ['localhost:9092'],
})


const producer = kafka.producer();

const run = async () => {
    await producer.connect();

    let count = 0;

    setInterval(async () => {
        try {
            const event = {
                eventId : count,
                userId : `user_${Math.floor(Math.random() * 10)}`,
                type : 'CLICK',
                timestamp : new Date().toISOString()
            }


            await producer.send({
                topic : 'user-events',
                messages : [
                    {value : JSON.stringify(event)}
                ]
            })

            console.log("sent : " , event);
            count++;
        } catch(err){
            console.log("error : " , err);
        }
    }, 1000)
}

run();