const {Kafka} = require('kafkajs');

const kafka = new Kafka({
    clientId : 'ride-producer',
    brokers : ['localhost:9092'],
})


const producer = kafka.producer();

const cities = [
  {
    city: 'Bangalore',
    areas: ['Koramangala', 'Indiranagar', 'Whitefield'],
  },
  {
    city: 'Mumbai',
    areas: ['Bandra', 'Andheri', 'Powai'],
  },
];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateRide = () => {
    const location = randomItem(cities);

    const rideId = `ride_${Math.floor(Math.random() * 100000)}`
    const riderId = `user_${Math.floor(Math.random() * 1000)}`
    const driverId = `driver_${Math.floor(Math.random() * 500)}`

    return {
        rideId, 
        riderId,
        driverId,
        city : location.city,
        area : randomItem(location.areas),
        fare : Math.floor(Math.random() * 500) + 100,
        distanceKm : (Math.random() * 15).toFixed(1),
    };
};


const sendEvent = async (event) => {

    await producer.send({
        topic : "ride-events",
        messages : [
            {
                key : event.rideId,
                value : JSON.stringify(event),
            }
        ]
    })

    console.log(`📨 ${event.eventType}`, event.rideId);
}

const simulatedRideLifecycle = async () => {
    const ride = generateRide();

    //ride requested

    const requestedEvent = {
        eventId : `evt_${Date.now()}`,
        eventType : 'RIDE_REQUESTED',
        timestamp : new Date().toISOString(),
        ...ride,
    }

    await sendEvent(requestedEvent)

    const cancelled = Math.random() < 0.15;

    if(cancelled) {
        setTimeout(async () => {
            await sendEvent({
                eventId : `evt_${Date.now()}`,
                eventType : 'RIDE_CANCELLED',
                timestamp : new Date().toISOString(),
                ...ride
            })
        }, 3000)

        return;
    }

    //driver assigned 

    setTimeout(async () => {
        await sendEvent({
            eventId : `evt_${Date.now()}`,
            eventType : 'DRIVER_ASSIGNED',
            timestamp : new Date().toISOString(),
            ...ride
        })
    },2000);

    // ride started 

    setTimeout(async () => {
        await sendEvent({
            eventId : `evt_${Date.now()}`,
            eventType : 'RIDE_STARTED',
            timestamp : new Date().toISOString(),
            ...ride
        })
    }, 5000)

    //ride ended 

    setTimeout(async () => {
        await sendEvent({
            eventId : `evt_${Date.now()}`,
            eventType : 'RIDE_COMPLETED',
            timestamp : new Date().toISOString(),
            durationMinutes : Math.floor(Math.random() * 40) + 10,
            ...ride
        })
    },10000)
}


const run = async () => {
    await producer.connect();
    
    console.log('🚖 Ride simulation started');

    setInterval(simulatedRideLifecycle,1000)

}

run();